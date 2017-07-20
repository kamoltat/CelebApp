import { SearchProvider } from '../../providers/search-service/search-service';
import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
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
  items: string[];
  idolItems: FirebaseListObservable<any[]>
  newItem ='';
  storageRef = firebase.storage().ref();
  image: any;
  items2:any[]= [];

  constructor(public navCtrl: NavController, public firebaseProvider: SearchProvider,
    public af: AngularFireModule, public zone:NgZone) {
    this.idolItems = this.firebaseProvider.getIdols();
    this.initializeItems();
    this.getImage();
    this.displayIdol();    
    
    console.log("I'm in search page")
  
  }

  displayIdol(){
    var temp = [];
    var childData = "";
    console.log("I'm in display idol")
    var query = firebase.database().ref("idols").orderByKey();
    //var ref = firebase.database().ref("idol/").once('value', function(snapshot) {
    
    query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(childSnapshot =>{
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          childData = childSnapshot.val();
          temp.push(childData);
      });
    });

    this.items2 = temp;
  }
  

  getImage(){
    this.storageRef.child("displayPic/yasuo.png").getDownloadURL().then((url)=>{this.image = url;
    });
  }

  initializeItems() {
    this.items = [
      'Yasuo',
      'Xayah',
      'Rakan'
      
    ];
  }


  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
 
  addItem() {
    this.firebaseProvider.addItem(this.newItem);
  }
 
  removeItem(id) {
    this.firebaseProvider.removeItem(id);
  }

  }


