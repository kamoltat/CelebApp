import { Component, NgZone, OnInit, Injectable } from '@angular/core';
import { App, NavController, ToastController, ActionSheetController, AlertController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { LoginPage } from '../login/login';
import { CreateProfilePage } from '../create-profile/create-profile';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { CommentPage } from '../comment/comment';
import { SubjectProvider } from '../../providers/subject-service/subject-service';
import { SearchProvider } from "../../providers/search-service/search-service";
import { TempProfilePage } from '../temp-profile/temp-profile';

@Component({
  selector: 'page-contact',
  templateUrl: 'profile.html',
  providers: [SearchProvider]
})


@Injectable()
export class ProfilePage implements OnInit {

  username: string;
  firstname: string;
  lastname: string;
  about: string;
  profile_pic: any;
  profile_pic_url: any;
  is_celeb: any;
  storageRef: any;
  currentUserUid: any;
  following: any;
  followingArr: any;
  subjectPost_list: any;
  private data: any = {};
  followStatus: string;
  email: any;
  subjUID: any;

  constructor(public navCtrl: NavController, public userService: UserServiceProvider, private zone: NgZone,
    public appCtrl: App, private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth, private toastCtrl: ToastController
    , private alertCtrl: AlertController, private actionSheetCtrl: ActionSheetController, private _subjectProvider: SubjectProvider
    , private searchProvider: SearchProvider) {

    this.storageRef = firebase.storage().ref();
    this.currentUserUid = firebase.auth().currentUser.uid;
    this.following = new Array();
    this.followingArr = new Array();
    this.subjectPost_list = new Array();
  }

  logUserOut() {
    this.userService.logoutUser().then(() => {
      return this.appCtrl.getRootNav().setRoot(LoginPage);
      //call user service
    });
  }
  goToCreateProfile() {
    //when click on edit button, this trigers
    this.navCtrl.push(CreateProfilePage);
  }

  setIsCeleb(e) {
    this.is_celeb = e;
  }

  isCurrentUserCeleb() {    //Check if current is idol or follower
    var user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref().child("idols").on('value', snapshot => {
        this.setIsCeleb(snapshot.hasChild(user.uid));
      })
    }
    else {
      this.navCtrl.setRoot(LoginPage);
    }

  }

  loadProfile() {
    var user = firebase.auth().currentUser;
    var root = 'users/';
    if (this.is_celeb) {
      root = 'idols/';
    }
    if (user && user.email && user.uid) {
      console.log("profile user.uid:", user.uid);
      firebase.database().ref(root + user.uid).on('value', snapshot => {
        this.username = snapshot.val().username;
        this.firstname = snapshot.val().firstname;
        this.lastname = snapshot.val().lastname;
        this.about = snapshot.val().about;
        this.email = snapshot.val().email;
        this.profile_pic_url = snapshot.val().profile_pic_url;
        firebase.storage().ref().child(this.profile_pic_url).getDownloadURL().then((url) => {
          this.zone.run(() => {
            this.profile_pic = url;
          })
        });
      });
    }

    else {
      this.navCtrl.setRoot(LoginPage);
      console.log("no user signed in")
    }
  }

  followButtonFunc() {
    this.searchProvider.followButtonFunc(this.subjUID, this.data);
  }

  //combine data to put into following database
  combineData() {
    this.data.about = this.about;
    this.data.email = this.email;
    this.data.firstname = this.firstname;
    this.data.lastname = this.lastname;
    this.data.profile_pic_url = this.profile_pic_url;
    this.data.username = this.username;
  }

  setFollowStyle() {
    var color: string = this.searchProvider.setFollowColor(this.currentUserUid);
    this.followStatus = this.searchProvider.setFollowStatus(this.currentUserUid);
    return color
  }

  getFollowing() {
    this.following = new Array();
    var temp: any = {};
    var query = firebase.database().ref("following").child(this.currentUserUid).orderByKey();
    query.once("value", snapshot => {
      snapshot.forEach(childSnapshot => {
        var key = childSnapshot.key;
        // childData will be the actual contents of the child
        var childData = childSnapshot.val();
        temp.idolKey = key;
        this.storageRef.child(childData['profile_pic_url']).getDownloadURL().then((url) => {
          this.zone.run(() => {
            childData['profile_pic_url'] = url;
          }).catch(e => {
            console.log("");
          });
        }).catch(e => {
          console.log("");
        });
        //merge two objects together (this is to add idol Key into the object of the idol itself.)
        var finalData = Object.assign(childData, temp);
        delete finalData.password;
        //pushing merged data to items
        this.following.push(finalData);
        return false;
      });
    })
  }

  //---------------------------Posts tab--------------------------------------------------------------------------
  showConfirmation(post_lists, post, postuid, postkey) {
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

            var postRef = firebase.database().ref("posts/" + postuid + "/" + postkey);
            postRef.once('value').then(snapshot => {
              var childData = snapshot.val();
              if (childData.post_pic_url != "") {
                var storageRef = firebase.storage().ref(childData.post_pic_path);
                storageRef.delete();
              }
              if(childData.post_vid_url){
                var vidStorageRef = firebase.storage().ref(childData.post_vid_path);
                vidStorageRef.delete();
              }
              postRef.remove();
              var i = post_lists.indexOf(post);
              post_lists.splice(i, 1);
            });

          }
        }
      ]
    });
    confirm.present();
  }

  clickOptions(post_lists, post, postuid, postkey) {
    console.log(post_lists, post, postuid, postkey);
    if (post.uid == this.currentUserUid) {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Your Post',
        buttons: [
          {
            text: 'Edit',
            handler: () => {
              console.log('Browse clicked');
            }
          }, {
            text: 'Delete',
            handler: () => {
              actionSheet.onDidDismiss((() => {
                this.showConfirmation(post_lists, post, postuid, postkey);
              }));
            }
          }, {
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
    else {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'This Post',
        buttons: [
          {
            text: 'Hide',
            handler: () => {
              console.log('Browse clicked');
            }
          }, {
            text: 'Report',
            handler: () => {
              actionSheet.onDidDismiss((() => {
              }));
            }
          }, {
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

  togglelikes(p, e, uid) {
    var user = firebase.auth().currentUser;
    var postRef = firebase.database().ref("posts/" + uid + "/" + e);
    postRef.transaction(post => {
      var i = this.subjectPost_list.indexOf(p);
      console.log("p", p);
      console.log("this", this.subjectPost_list);
      console.log(this.subjectPost_list[p]);
      if (post) {
        if (post.likes && post.likes[user.uid]) {
          post.likeCount--;
          this.subjectPost_list[i].likeCount--;
          post.likes[user.uid] = null;
          this.subjectPost_list[i].likes[user.uid] = null;
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
    }, function () { }, true);
  }


  clickComment(e, uid, post, listPost) {
    this.navCtrl.push(CommentPage, {
      postid: e,
      postuid: uid,
      post: post,
      list_post: listPost
    });

  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.subjUID = this.getSubjUID();
      this.loadProfile();
      this.combineData();
      this.getFollowing();
      this.getFollowingArray();
      this._subjectProvider.setSubjectPosts(this.currentUserUid);
      this.subjectPost_list = this._subjectProvider.getSubjectPosts();
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  getLikeColor(e) {
    if (e.likes) {
      if (e.likes[this.currentUserUid]) {
        return "green";
      }
    }
    return "";
  }


  clickLikeButton(p, e, uid) { //e in this function is the key of each post which we can get by clicking on the button, uid is the poster's uid
    this.togglelikes(p, e, uid);
  }



  //--------------------------------------------------Posts Tab-----------------------------------------------------------------

  setSubjUID(inpUID) {
    console.log(inpUID);
    this._subjectProvider.setSubjUID(inpUID);
    this.navCtrl.push(TempProfilePage);
  }

  getFollowingArray() {
    this.followingArr = this.following;
  }

  ngOnInit() {
    this.subjUID = this.getSubjUID();
    this.isCurrentUserCeleb();
    this.loadProfile();
    this.combineData();
    this.getFollowing();
    this.getFollowingArray();
    this._subjectProvider.setSubjectPosts(this.currentUserUid);
    this.subjectPost_list = this._subjectProvider.getSubjectPosts();
  }


  ionViewWillLoad() {
    //load user's data
  }

  getSubjUID(): string {
    var temp = this._subjectProvider.getsubjUID();
    console.log("getSubjUID in profile page", temp);
    return this._subjectProvider.getsubjUID();
  }

}

