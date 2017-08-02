import { Injectable,NgZone } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';


@Injectable()
export class SearchProvider {

  idolItems2: any;
  public container= new Array();
 
  constructor(public afd: AngularFireDatabase, public zone: NgZone) {
    this.idolItems2 = firebase.database().ref('idols');

  }

 
  addItem(name) {
    this.afd.list('/following/').push(name);
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


