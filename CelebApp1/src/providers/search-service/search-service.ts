import { Injectable, NgZone } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';


@Injectable()
export class SearchProvider {

  idolItems2: any;
  public container = new Array();
  items = new Array();
  idolArray = new Array();

  constructor(public afd: AngularFireDatabase, public zone: NgZone) {

  }

  setRef(refQuery) {
    this.getRef(refQuery);
    return this.items
  }

  getRef(refQuery) {
    var temp: any = {};
    refQuery.once("value")
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          temp.idolKey = key;
          firebase.storage().ref().child(childData['profile_pic_url']).getDownloadURL().then((url) => {
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
          this.items.push(finalData);
        }).catch(e => {
          console.log("");
        });
      }).catch(e => {
        console.log("");
      });
  }

  setIsFollowing(e) {
    return e
  }

  isFollowing(key) {
    var is_following: boolean;
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
    var is_following = this.isFollowing(idolKey);
    if (is_following) {
      ref.remove();
    }
    else {
      ref.set(data);
    }

  }

  setFollowStatus(key) {
    var is_following = this.isFollowing(key);
    if (is_following) {
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

  getIdolArray(setRef) {
    this.getRef(setRef);
    this.idolArray = this.items;
  }


}


