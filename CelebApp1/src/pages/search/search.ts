import { SearchProvider } from '../../providers/search-service/search-service';
import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

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

  username:string;
  firstname:string;
  lastname:string;

  constructor(public navCtrl: NavController, public firebaseProvider: SearchProvider,
     public af: AngularFireModule, public zone:NgZone) {
    this.idolItems = this.firebaseProvider.getIdols();
    this.initializeItems();
    this.getImage();
    
  }

  displayIdol(theIdolID){}

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


