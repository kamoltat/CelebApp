import { SearchProvider } from '../../providers/search-service/search-service';
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { FirebaseListObservable } from 'angularfire2/database';

import firebase from 'firebase';
import { IdolServiceProvider } from '../../providers/idol-service/idol-service';
import {LoginPage } from '../login/login';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'page-about',
  templateUrl: 'search.html',
  providers:[SearchProvider]
})

export class SearchPage {
  searchQuery: string = '';
  newItem ='';
  storageRef = firebase.storage().ref();
  image: any;
  public items = new Array();
  public idolKey= new Array();
  public idolArray: any;

  constructor(public navCtrl: NavController, public firebaseProvider: SearchProvider,
    public af: AngularFireModule, public zone:NgZone, public navParams: NavParams) {
    this.getImage();
    

    console.log("I'm in search page")
  
  }

  //Getting idols from firebase
  getIdols(){
    var temp:any={};    
    var query = firebase.database().ref("idols").orderByKey();
    query.once("value")
    .then(snapshot => {
    snapshot.forEach(childSnapshot => {
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
      temp.idolKey = key;

      //merge two objects together (this is to add idol Key into the object of the idol itself.)
      var finalData = Object.assign(childData,temp);
      console.log('final Data:', finalData);

      //pushing merged data to items
      this.items.push(finalData);
        });
    }); 
  }

  //needs fixing
  getImage(){
    this.storageRef.child("displayPic/yasuo.png").getDownloadURL().then((url)=>{this.image = url;
    });
  }

  //Initiate Idol Array so that it doesnt get pushed multiple times
  getIdolArray(){
    this.idolArray = this.items;
    console.log('idolArray:',this.idolArray);
  } 

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


  //Initiate at Start of page
  ionViewWillLoad(){
    this.getIdols();
    this.getIdolArray();
  }


  //Adding function to follow button
  followButtonFunc(idolKey:any,data:any){
    var user = firebase.auth().currentUser;
    firebase.database().ref("following").child(user.uid).child(idolKey).set(data);
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
}


