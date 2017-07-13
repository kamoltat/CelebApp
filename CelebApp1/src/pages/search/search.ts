import {FirebaseProvider} from '../../providers/firebase';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-about',
  templateUrl: 'search.html',
  providers:[FirebaseProvider]
})

export class SearchPage {
  searchQuery: string = '';
  items: string[];
  shoppingItems: FirebaseListObservable<any[]>
  newItem ='';

  constructor(public navCtrl: NavController, public firebaseProvider: FirebaseProvider) {
    this.shoppingItems = this.firebaseProvider.getShoppingItems();
    this.initializeItems();
  }

  initializeItems() {
    this.items = [
      'Amsterdam',
      'Bogota',
      
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


