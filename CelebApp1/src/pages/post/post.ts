import { Component, NgZone } from '@angular/core';
import {IonicPage, NavController, NavParams,ToastController, ViewController } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service'
import firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable} from 'angularfire2/database';
import {CreateProfilePage} from '../create-profile/create-profile';
import {ShareServiceProvider} from '../../providers/share-service/share-service';
import { Camera, CameraOptions } from '@ionic-native/camera';


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
  video: any;

  constructor(public navCtrl: NavController, public navParams:NavParams,
  public userProvider: UserServiceProvider, 
  public afAuth: AngularFireAuth, private toastCtrl: ToastController, 
  private afDatabase: AngularFireDatabase, public zone: NgZone, public ViewCtrl: ViewController,
  private shareservice:ShareServiceProvider,private camera: Camera) {
  var user = firebase.auth().currentUser;
  this.timeStamp = Date.now();
  this.postkey = firebase.database().ref('post/'+user.uid).push().key;
  this.listPosts = this.navParams.get('list_posts');
  this.text = "";
  
}
  closePostPage(){
    this.ViewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditUserPicPage');
  }

  selectfile(e){
   console.log("e",e);
   this.image = null;
   this.video = null;
   if(e.target){
   this.file = e.target.files[0]
   }
  else{
    this.file = e[0];
  }
   if(!this.file.type.includes("video/") && !this.file.type.includes("image/")){
      alert("Please insert only video or image");
   }else{
   this.readPhoto(this.file);
   console.log(this.file);
   }

}

cameraPhotoButton(){
const options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.DATA_URL,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE,
  correctOrientation: true,
  allowEdit:true
}
  this.camera.getPicture(options).then((imageData) => {

// imageData is either a base64 encoded string or a file URI
 // If it's base64:
 let base64Image = 'data:image/jpeg;base64,' + imageData;
 this.image = base64Image;
 
 
}, (err) => {
 console.log(err);
});
}



startUpload(postData){
  var user = firebase.auth().currentUser;
  if(this.file){
  if(this.image != null){
  this.storageRef.child('image/posts/'+user.uid+'/'+this.postkey+'/post_pic').put(this.file).
  then((snapshot) =>{
    alert("upload " + this.file.name+" success!");
    var user = firebase.auth().currentUser;
    firebase.database().ref('posts/' + user.uid+'/'+this.postkey+'/post_pic_path').set('image/posts/'+user.uid+'/'+this.postkey+'/post_pic');
    this.storageRef.child('image/posts/'+user.uid+'/'+this.postkey+'/post_pic').getDownloadURL().then((url)=> 
  {
    this.zone.run(()=>{
    firebase.database().ref('posts/' + user.uid+'/'+this.postkey+'/post_pic_url').set(url);
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

else if(this.video != null){
  this.storageRef.child('video/posts/'+user.uid+'/'+this.postkey+'/post_vid').put(this.file).
  then((snapshot) =>{
    alert("upload " + this.file.name+" success!");
    var user = firebase.auth().currentUser;
    firebase.database().ref('posts/' + user.uid+'/'+this.postkey+'/file_type').set(this.file.type);
    postData['file_type'] = this.file.type;
    firebase.database().ref('posts/' + user.uid+'/'+this.postkey+'/post_vid_path').set('video/posts/'+user.uid+'/'+this.postkey+'/post_vid');
    this.storageRef.child('video/posts/'+user.uid+'/'+this.postkey+'/post_vid').getDownloadURL().then((data)=> 
  {
    this.zone.run(()=>{
    firebase.database().ref('posts/' + user.uid+'/'+this.postkey+'/post_vid_url').set(data);
    postData['post_vid_url'] = data;
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
  }
  else{
    if(this.image != null){
      this.storageRef.child('image/posts/'+user.uid+'/'+this.postkey+'/post_pic').putString(this.image,firebase.storage.StringFormat.DATA_URL).
      then((snapshot) =>{
        alert("upload picture success!");
        var user = firebase.auth().currentUser;
        firebase.database().ref('posts/' + user.uid+'/'+this.postkey+'/post_pic_path').set('image/posts/'+user.uid+'/'+this.postkey+'/post_pic');
        this.storageRef.child('image/posts/'+user.uid+'/'+this.postkey+'/post_pic').getDownloadURL().then((url)=> 
      {
        this.zone.run(()=>{
        firebase.database().ref('posts/' + user.uid+'/'+this.postkey+'/post_pic_url').set(url);
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
    else if(this.video != null){
      this.storageRef.child('video/posts/'+user.uid+'/'+this.postkey+'/post_vid').putString(this.video,firebase.storage.StringFormat.DATA_URL).
      then((snapshot) =>{
        alert("upload video success!");
        var user = firebase.auth().currentUser;
        firebase.database().ref('posts/' + user.uid+'/'+this.postkey+'/file_type').set("video/mp4");
        postData['file_type'] = "video/mp4";
        firebase.database().ref('posts/' + user.uid+'/'+this.postkey+'/post_vid_path').set('video/posts/'+user.uid+'/'+this.postkey+'/post_vid');
        this.storageRef.child('video/posts/'+user.uid+'/'+this.postkey+'/post_vid').getDownloadURL().then((data)=> 
      {
        this.zone.run(()=>{
        firebase.database().ref('posts/' + user.uid+'/'+this.postkey+'/post_vid_url').set(data);
        postData['post_vid_url'] = data;
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

  }




}

readPhoto(file){
  let reader = new FileReader();
  let path:any;
  reader.onload = (e) =>{
    this.zone.run(() => {
    path = e.target;
    if(this.file.type.includes("video/")){
     console.log("it's a video");
     console.log(this.video)
     this.image = null;
     this.video = path.result;
   }
  else if(this.file.type.includes("image/")){
    console.log("it's an image");
    console.log("path.reslt",path.result);
    this.video = null;
    this.image = path.result;
    console.log("this.file:",this.file)
    console.log("this.image:",this.image)

  }
 
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
    commentCount: 0,
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
  postData.timeStamp = new Date(postData.timeStamp).toLocaleDateString();
  postData['key'] = this.postkey;
  postData['uid'] = user.uid;
  if(this.image != null || this.video != null){
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
firebase.database().ref('idols/' + user.uid).once('value', snapshot => {
this.username = snapshot.val().username;
this.authorPicUrl = snapshot.val().profile_pic_url;
  });
}
  }

}

