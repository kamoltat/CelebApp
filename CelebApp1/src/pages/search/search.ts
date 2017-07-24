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
  public idolArray: any;

  constructor(public navCtrl: NavController, public firebaseProvider: SearchProvider,
    public af: AngularFireModule, public zone:NgZone, public navParams: NavParams) {
    this.getImage();
    

    console.log("I'm in search page")
  
  }

  getIdols(){    
    var query = firebase.database().ref("idols").orderByKey();
    query.once("value")
    .then(snapshot => {
    snapshot.forEach(childSnapshot => {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
          this.items.push(childData);
      
        });
    }); 
  }

  getImage(){
    this.storageRef.child("displayPic/yasuo.png").getDownloadURL().then((url)=>{this.image = url;
    });
  }

  
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


 getIdolArray(){
   this.idolArray = this.items;
   console.log('idolArray:',this.idolArray);
 } 

 
  addItem() {
    this.firebaseProvider.addItem(this.newItem);
  }
 
  removeItem(id) {
    this.firebaseProvider.removeItem(id);
  }


  ionViewWillLoad(){
    this.getIdols();
    this.getIdolArray();
  }

}


