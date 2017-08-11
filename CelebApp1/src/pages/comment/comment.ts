import { Component,OnInit, NgZone, } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import {LoginPage} from '../login/login';
import {ShareServiceProvider} from '../../providers/share-service/share-service';
import {HomePage} from '../home/home';

/**
 * Generated class for the CommentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
  providers: [ShareServiceProvider]
  
})



export class CommentPage implements OnInit {
  
  public commentText = "";
  public postid:any;
  public post:any;
  public postuid:any;
  public username:any;
  public profile_pic_url:any;
  public is_celeb:any;
  public root = "users/";
  public imageRoot = "user_profile/";
  public timeStamp:any;
  public listComment = new Array();
  private postObject:any;
  public currentUserId:any;
  public listPost:any;
  


  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public alert:AlertController, public zone:NgZone, public shareService: ShareServiceProvider,) {
     this.postid = navParams.get('postid');
     this.postuid = navParams.get('postuid');
     this.postObject = navParams.get('post');
     this.listPost = navParams.get('list_post');
     this.shareService.setCommentPosts(this.postuid,this.postid);
     this.currentUserId = firebase.auth().currentUser.uid;
     this.timeStamp = Date.now();
  
  }

setIsCeleb(e){
  this.is_celeb = e;
  if(e){
    this.root = 'idols/';
    this.imageRoot = 'idol_profile/';
  }
}

isCurrentUserCeleb(){    //Check if current is idol or follower
var user = firebase.auth().currentUser;
if(user){
firebase.database().ref().child("idols").on('value', snapshot =>{
  this.setIsCeleb(snapshot.hasChild(user.uid));
  console.log("I'm inside");
});
}
else{
  this.navCtrl.setRoot(LoginPage);
}
}

deleteClicked(comment,commentKey){
  console.log(commentKey);
  let confirm = this.alert.create({
      title: 'Delete Comment?',
      message: 'Are you sure want to delete your comment?',
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
            console.log(comment);
            var i = this.listComment.indexOf(comment);
            this.listComment.splice(i,1);
            firebase.database().ref('posts/'+this.postuid+'/'+this.postid+'/'+'comments/'+commentKey).remove();
            firebase.database().ref('posts/'+this.postuid+'/'+this.postid+'/commentCount').transaction(count => {
                if(count){
                  count--;
                  var i = this.listPost.indexOf(this.postObject);
                  this.listPost[i].commentCount --;
                  
                }
                return count;
              });
                      }
                    }
                  ]
                });
    confirm.present();
}

postClicked(){
    var user = firebase.auth().currentUser;
    var postRef = firebase.database().ref("posts/"+this.postuid+"/"+this.postid);
    console.log(this.postuid);
    console.log(this.postid);
    postRef.transaction(post =>{
    if(post){
    if(!post.commentCount){
    post.commentCount = 0;
    }
    var i = this.listPost.indexOf(this.postObject);
    this.listPost[i].commentCount ++;
    post.commentCount++;
    if(!post.comments){
    post.comments = {};
    }
    var commentKey = firebase.database().ref("posts/"+this.postuid+"/"+this.postid+"/comments").push().key;
    var commentObject = {
      text:this.commentText, 
      author:this.username,
      authorPicUrl:this.profile_pic_url,
      authorUid:user.uid,
      timeStamp: this.timeStamp
    };
    post.comments[commentKey] = commentObject;
     firebase.storage().ref().child(commentObject['authorPicUrl'].toString()).getDownloadURL().then((url)=> 
  {
    this.zone.run(()=>{
    commentObject['authorPicUrl'] = url;
    
    }).catch(e => {
    console.log(e);
    
  });
  }).catch(e => {
    console.log(e);
  });
   
    commentObject['timeStamp'] = new Date(commentObject['timeStamp']).toLocaleDateString()
    this.listComment.push(commentObject)
    }
    return post;
    }); 
    alert("posted!");
  }

    
setUserProfile(){
var user = firebase.auth().currentUser;
firebase.database().ref(this.root+user.uid).on("value",snapshot =>{
this.username = snapshot.val().username;
this.profile_pic_url = snapshot.val().profile_pic_url;
});
}

ngOnInit(){
    this.isCurrentUserCeleb();
    // this.getComment();
    this.listComment = this.shareService.getCommentPost();
    this.setUserProfile();
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentPage');
  }
  ionViewDidEnter(){
    
  }
  

}
