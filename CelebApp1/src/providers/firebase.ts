import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
 
@Injectable()
export class FirebaseProvider {
 
  constructor(public afd: AngularFireDatabase) { }
 
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
}