import { Component,NgZone,OnInit,Injectable } from '@angular/core';
import { App,ToastController, IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth';
import { SearchPage } from '../search/search';
import { SubjectProvider } from '../../providers/subject-service/subject-service';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
import {CommentPage} from "../comment/comment";




@IonicPage()
@Component({
  selector: 'page-temp-profile',
  templateUrl: 'temp-profile.html',
})

@Injectable()
export class TempProfilePage {
  email:string;
  username:string;
  firstname:string;
  lastname:string;
  about:string;
  profile_pic:any;  
  profile_pic_url:any;  
  is_celeb:any;
  subjUID:any;
  public following= new Array();
  public followingArr = new Array();
  public data:any={};
  refString = "following/"+this.subjUID;
  storageRef = firebase.storage().ref();
  public subjectPost_list: any;
  public currentU:any;
  
  constructor(public navCtrl: NavController, private _subjectProvider:SubjectProvider,public zone:NgZone,
              public appCtrl: App, private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth,
              private toastCtrl:ToastController, private actionSheetCtrl:ActionSheetController, private alertCtrl: AlertController) {
                this.subjectPost_list = new Array();
                this.currentU = firebase.auth().currentUser;
  }

  //Adding function to follow button
  followButtonFunc(){
    var user = firebase.auth().currentUser;
    firebase.database().ref("following/").child(user.uid).child(this.subjUID).set(this.data);
  }
  
  //combine data to put into following database
  combineData(){
    this.data.about=this.about;
    this.data.email=this.email;
    this.data.firstname=this.firstname;
    this.data.lastname=this.lastname;
    this.data.profile_pic_url=this.profile_pic_url;
    this.data.username=this.username;
  }

  
    //get who the user is following and the data in there.
    //then put in array
  getFollowing(){
    var temp:any={};    
    var query = firebase.database().ref("following").child(this.subjUID).orderByKey();
    query.once("value")
    .then(snapshot => {
    snapshot.forEach(childSnapshot => {
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
      temp.idolKey = key;
      this.storageRef.child(childData['profile_pic_url']).getDownloadURL().then((url)=>{
      this.zone.run(() =>{ childData['profile_pic_url'] = url;
    }).catch(e=>{
          console.log("");
        });
    }).catch(e=>{
          console.log("");
        });
      //merge two objects together (this is to add idol Key into the object of the idol itself.)
      var finalData = Object.assign(childData,temp);
      delete finalData.password;
      //pushing merged data to items
      this.following.push(finalData);
        }).catch(e=>{
          console.log("");
        });
    }).catch(e=>{
          console.log("");
        }); 
  }

  getFollowingArray(){
    this.followingArr = this.following;
  }

  

  setIsCeleb(e){
    this.is_celeb = e;
  }

  isCurrentUserCeleb(){    //Check if current is idol or follower
    if(this.subjUID){
    firebase.database().ref().child("idols").on('value', snapshot =>{
      this.setIsCeleb(snapshot.hasChild(this.subjUID));
      })  
    }
    else{
      this.navCtrl.setRoot(LoginPage);
    }

  }

  loadProfile(){
    var root = 'users/';
    if(this.is_celeb){
      root = 'idols/';
    }
    console.log("temp-profile's subjUID:", this.subjUID)
    firebase.database().ref(root + this.subjUID).on('value', snapshot => {
    this.username = snapshot.val().username;
    this.firstname = snapshot.val().firstname;
    this.lastname = snapshot.val().lastname;
    this.about = snapshot.val().about;
    this.email = snapshot.val().email;
    this.profile_pic_url = snapshot.val().profile_pic_url;  
    firebase.storage().ref().child(this.profile_pic_url).getDownloadURL().then((url) => 
      {
        this.zone.run(()=>{
          this.profile_pic = url;
        })
      });
    });
  }

  //---------------------------Posts tab--------------------------------------------------------------------------
showConfirmation(post_lists,post,postuid,postkey){
let confirm = this.alertCtrl.create({
      title: 'Delete This Post?',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
          
          var postRef = firebase.database().ref("posts/"+postuid+"/"+postkey);
          postRef.once('value').then(snapshot =>{
            var childData = snapshot.val();
            if(childData.post_pic_url != ""){
              var storageRef = firebase.storage().ref(childData.post_pic_url);
              storageRef.delete();
            }
            postRef.remove();
            var i = post_lists.indexOf(post);
            post_lists.splice(i,1);
          });

          }
        }
      ]
    });
    confirm.present();
}

clickOptions(post_lists,post,postuid,postkey){
  console.log(post_lists,post,postuid,postkey);
  if(post.uid == this.currentU.uid){
  let actionSheet = this.actionSheetCtrl.create({
      title: 'Your Post',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            console.log('Browse clicked');
          }
        },{
          text: 'Delete',
          handler: () => {
          actionSheet.onDidDismiss((()=>{
            this.showConfirmation(post_lists,post,postuid,postkey);
        }));
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  else{
    let actionSheet = this.actionSheetCtrl.create({
      title: 'This Post',
      buttons: [
        {
          text: 'Hide',
          handler: () => {
            console.log('Browse clicked');
          }
        },{
          text: 'Report',
          handler: () => {
          actionSheet.onDidDismiss((()=>{
        }));
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
    
  }
}

 togglelikes(p,e,uid){
   var user = firebase.auth().currentUser;
   var postRef = firebase.database().ref("posts/"+uid+"/"+e); 
    postRef.transaction(post =>{
    var i = this.subjectPost_list.indexOf(p);
    console.log("p", p);
    console.log("this", this.subjectPost_list);
    console.log(this.subjectPost_list[p]);
    if (post) {
      if (post.likes && post.likes[user.uid]) {
        post.likeCount--;
        this.subjectPost_list[i].likeCount--;
        post.likes[user.uid] = null;
        this.subjectPost_list[i].likes[user.uid] =null;
      } else {
        post.likeCount++;
        this.subjectPost_list[i].likeCount++;
        if (!post.likes) {
          post.likes = {};
         this.subjectPost_list[i].likes = {};
        }
        this.subjectPost_list[i].likes[user.uid] = true;
        post.likes[user.uid] = true;
        
      }
    };
    return post;
},function(){},true);
 }


 clickComment(e,uid,post,listPost){
   this.navCtrl.push(CommentPage,{
     postid: e, 
     postuid:uid,
     post:post,
     list_post:listPost });

 }

 getLikeColor(e){
  if(e.likes){
    if(e.likes[this.currentU.uid]){
    return "green";
    }
  }
    return "";
 }


clickLikeButton(p,e,uid){ //e in this function is the key of each post which we can get by clicking on the button, uid is the poster's uid
  this.togglelikes(p,e,uid);
}



  //--------------------------------------------------Posts Tab-----------------------------------------------------------------

  ngOnInit(){
    this.subjUID = this.getSubjUID();
    this.isCurrentUserCeleb();
    this.loadProfile();
    this.combineData();
    this.getFollowing();
    this.getFollowingArray();
    this._subjectProvider.setSubjectPosts(this.subjUID);
    this.subjectPost_list = this._subjectProvider.getSubjectPosts();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TempProfilePage');
  }

  getSubjUID():string{
    var temp = this._subjectProvider.getsubjUID();
    console.log("getSubjUID in temp-profile", temp);
    return this._subjectProvider.getsubjUID();
  }

}
