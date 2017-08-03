import { SearchProvider } from '../../providers/search-service/search-service';
import { Component, NgZone, OnInit,Injectable } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { FirebaseListObservable } from 'angularfire2/database';

import firebase from 'firebase';
import { IdolServiceProvider } from '../../providers/idol-service/idol-service';
import {LoginPage } from '../login/login';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth';
import { TempProfilePage } from '../temp-profile/temp-profile';
import { SubjectProvider } from '../../providers/subject-service/subject-service';


@Component({
  selector: 'page-about',
  templateUrl: 'search.html',
  providers:[SearchProvider]
})

@Injectable()
export class SearchPage implements OnInit {
  searchQuery: string = '';
  newItem ='';
  storageRef = firebase.storage().ref();
  image: any;
  public items = new Array();
  public idolKey= new Array();
  public idolArray: any;
  public followData:any={};
  // is_following:number;
  idolUID:string;

  constructor(public navCtrl: NavController, public firebaseProvider: SearchProvider,
    public af: AngularFireModule, public zone:NgZone, public navParams: NavParams,
    private _subjectProvider: SubjectProvider){
    

    console.log("I'm in search page")
  
  }

  // getImage(childData){
  //   this.storageRef.child(childData['profile_pic_url']).getDownloadURL().then((url)=>{
  //     this.zone.run(() =>{ this.image = url;
  //   });
  //   });
  //   return this.image;
  // }


  //Getting idols from firebase
  getIdols(){
    var temp:any={};    
    var query = firebase.database().ref("idols").orderByKey();
    query.once("value")
    .then(snapshot => {
    snapshot.forEach(childSnapshot => {
      var key = childSnapshot.key;
      this.idolUID = key
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
      this.items.push(finalData);
        }).catch(e=>{
          console.log("");
        });
    }).catch(e=>{
          console.log("");
        }); 
  }


  //Initiate Idol Array so that it doesnt get pushed multiple times
  getIdolArray(){
    this.idolArray = this.items;
    console.log('idolArray:',this.idolArray);
  } 


  //Initiate at Start of page

  ngOnInit(){
    this.getIdols();
    this.getIdolArray();
  }

  ionViewWillLoad(){
    
  }


  //Adding function to follow button
  followButtonFunc(idolKey:any,data:any){
    var user = firebase.auth().currentUser;
    delete data.followColor;
    firebase.database().ref("following/").child(user.uid).child(idolKey).set(data);
    console.log(data);
  }

  //Search Function
  getItems(ev: any) {
    this.getIdolArray();
    console.log('idolArray in getItems():',this.idolArray);
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
        this.idolArray = this.idolArray.filter((item, username) => {
            console.log(item);    
            return (item.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    }
  
  }
  
  setSubjUID(inpUID){
    this._subjectProvider.setSubjUID(inpUID);
    this.navCtrl.push(TempProfilePage);
  }

  setIsFollowing(e){
    // this.is_following = e;
    return e
  }

  isUserFollowing(key){
    console.log("im in isUserFollowing");
    var is_following
    var user = firebase.auth().currentUser;
    firebase.database().ref("following").child(user.uid).on('value', snapshot =>{
     
    is_following = this.setIsFollowing(snapshot.hasChild(key));
    console.log("idolUID",key);
    console.log("is user following function",is_following);
      });
    if(is_following){
      return "green";
    }
    else{
      return "default"
    }
  }

  // setFollowColor(key){
  //   this.isUserFollowing(key);
  //   console.log()
  //   var followColor:string;
  //   followColor = "default";
  //   if(this.is_following){
  //     followColor = "light";
  //     console.log(followColor);
  //   }
  //   return followColor
  // }

  // navToUserProf(){
  //    this.navCtrl.push(tempProfilePage);
  // }
  
  ////////////////////////////////////// Adding and removing items ////////////////////////////////////////
  addItem() {
    //this.firebaseProvider.addItem('');
    var user = firebase.auth().currentUser;

    firebase.database().ref("following").child(user.uid).push("hello")

  }
 
  removeItem(id) {
    this.firebaseProvider.removeItem(id);
  }
  ////////////////////////////                   End                     ///////////////////////////////////

}
