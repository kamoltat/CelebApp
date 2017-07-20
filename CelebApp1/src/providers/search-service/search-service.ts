import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';
 
@Injectable()
export class SearchProvider {

  idolItems2: any;
 
  constructor(public afd: AngularFireDatabase) {
    this.idolItems2 = firebase.database().ref('idols');

  }
 
  getIdols() {
    return this.afd.list('/idols/');
  }
 
  addItem(name) {
    this.afd.list('/idols/').push(name);
  }
 
  removeItem(id) {
    this.afd.list('/idols/').remove(id);
  }

  followItem(id){
    this.afd.list('/profile/')
  }

  getIdol(userId: any){

    var idolRef = this.idolItems2.child('userId');
    return idolRef.once('value');{

      };
  }
    
}


