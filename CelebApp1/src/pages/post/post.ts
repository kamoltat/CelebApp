import { Component, NgZone } from '@angular/core';
import {IonicPage, NavController, NavParams,ToastController, ViewController } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service'
import firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable} from 'angularfire2/database';
import {CreateProfilePage} from '../create-profile/create-profile';
import {ShareServiceProvider} from '../../providers/share-service/share-service';
/**
 * Generated class for the PostPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
  providers: [ShareServiceProvider]
})

export class  PostPage {
  storageRef = firebase.storage().ref();
  image: any;
  file: any;
  text: string;
  public postkey:any;
  public username:any; 
  public timeStamp: any;
  public authorPicUrl:any;
  private listPosts:any;

  constructor(public navCtrl: NavController, public navParams:NavParams,
  public userProvider: UserServiceProvider, 
  public afAuth: AngularFireAuth, private toastCtrl: ToastController, 
  private afDatabase: AngularFireDatabase, public zone: NgZone, public ViewCtrl: ViewController,
  private shareservice:ShareServiceProvider) {
  var user = firebase.auth().currentUser;
  this.timeStamp = Date.now();
  this.postkey = firebase.database().ref('post/'+user.uid).push().key;
  this.listPosts = this.navParams.get('list_posts');
}
  closePostPage(){
    this.ViewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditUserPicPage');
  }

  selectfile(e){
   this.file = e.target.files[0]
   this.readPhoto(this.file);
}

startUpload(postData){
  var user = firebase.auth().currentUser;
  this.storageRef.child('image/posts/'+user.uid+'/'+this.postkey+'/post_pic').put(this.file).
  then((snapshot) =>{
    alert("upload " + this.file.name+" success!");
    var user = firebase.auth().currentUser;
    firebase.database().ref('posts/' + user.uid+'/'+this.postkey+'/post_pic_url').set('image/posts/'+user.uid+'/'+this.postkey+'/post_pic');
    this.storageRef.child('image/posts/'+user.uid+'/'+this.postkey+'/post_pic').getDownloadURL().then((url)=> 
  {
    this.zone.run(()=>{
    postData['post_pic_url'] = url;
    
    }).catch(e => {
    console.log(e);
      
  });
  }).catch(e => {
    console.log(e);
  });
    this.listPosts.push(postData);
    console.log(postData)
  });
}

readPhoto(file){
  let reader = new FileReader();
  reader.onload = (e) =>{
    this.zone.run(() => {
    let path:any = e.target;
    this.image = path.result;
    }); 
    
  }
  reader.readAsDataURL(file);
}

post(){
  var user = firebase.auth().currentUser;
  var postData = {
    author: this.username,
    authorPicUrl: this.authorPicUrl,
    body: this.text,
    likeCount: 0,
    post_pic_url: "",
    timeStamp: this.timeStamp,

    
  };
  firebase.database().ref('posts/' + user.uid+'/'+this.postkey).set(postData);
  this.storageRef.child(this.authorPicUrl.toString()).getDownloadURL().then((url)=> 
  {
    this.zone.run(()=>{
    postData['authorPicUrl'] = url;
    
    }).catch(e => {
    console.log(e);
      
  });
  }).catch(e => {
    console.log(e);
  });
  if(this.image != null){
    this.startUpload(postData);
  }
  else{
    console.log(postData);
    this.listPosts.push(postData);
  }
  this.ViewCtrl.dismiss();
}

ionViewWillLoad(){
var user = firebase.auth().currentUser;
if(user&&user.email&&user.uid){
firebase.database().ref('idols/' + user.uid).on('value', snapshot => {
this.username = snapshot.val().username;
this.authorPicUrl = snapshot.val().profile_pic_url;
    });}
  }

}

