import { Injectable, NgZone } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';


@Injectable()
export class SearchProvider {

  idolItems2: any;
  public container = new Array();

  constructor(public afd: AngularFireDatabase, public zone: NgZone) {
    this.idolItems2 = firebase.database().ref('idols');

  }

  getIdol(userId: any) {

    var idolRef = this.idolItems2.child('userId');
    return idolRef.once('value'); {

    };
  }

  setIsFollowing(e) {
    return e
  }
  
  isFollowing(key) {
    var is_following:boolean;
    var user = firebase.auth().currentUser;
    firebase.database().ref("following").child(user.uid).on('value', snapshot => {
      is_following = this.setIsFollowing(snapshot.hasChild(key));

    });
    return is_following
  }

  followButtonFunc(idolKey: any, data: any) {
    var user = firebase.auth().currentUser;
    var ref = firebase.database().ref("following/").child(user.uid).child(idolKey)
    var followRef = firebase.database().ref("following").child(user.uid);
    delete data.followColor;
      var is_following =this.isFollowing(idolKey);
        if(is_following){
          ref.remove();
        }
        else{
          ref.set(data);
        }

  }
  
  setFollowStatus(key){
    var is_following = this.isFollowing(key);
    if(is_following){
      return "Unfollow"
    }
    return "Follow"
  }

  setFollowColor(key) {
    var is_following = this.isFollowing(key);
    if (is_following) {
      return "grey";
    }
    return "";
  }

}


