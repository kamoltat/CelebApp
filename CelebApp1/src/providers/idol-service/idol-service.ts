import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class IdolServiceProvider {

public data: any;
public fireAuth:any;
public idolProfile: any;

  constructor(public http: Http) {
    this.fireAuth = firebase.auth();
    this.idolProfile = firebase.database().ref('idols');
    
    console.log('HelloIdolServiceProvider Provider');
  }



signUpIdol(email: string,password: string,username: string,firstname:string,lastname:string){
  return this.fireAuth.createUserWithEmailAndPassword(email, password).
  then((newIdol) => {
    //sign in the idol
      this.fireAuth.signInWithEmailAndPassword(email, password).then((
      authenticatedIdol) => {
        //sucessfully login, create idol profile
        this.idolProfile.child(authenticatedIdol.uid).set({
          email:email,
          password: password,
          username: username,
          firstname: firstname,
          lastname: lastname,
          profile_pic_url:"image/default_profile/default_profile_pic.jpg",
          about: ""

        });
      });
  });
}
loginIdol(email: string, password: string): any{
  return this.fireAuth.signInWithEmailAndPassword(email, password);
}
logoutIdol(): firebase.Promise<void>{
  firebase.database().ref('/profile').child(firebase.auth().currentUser.uid).off();
  return this.fireAuth.signOut();
  //redirection
}
 forgotPasswordIdol(email:any){
    return this.fireAuth.sendPasswordResetEmail(email);
  }
  googleSignInIdol(){
   var provider = new firebase.auth.GoogleAuthProvider();
   provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

   var that = this;
   return firebase.auth().signInWithPopup(provider).then(function(result){
    if(result.idol){
      var idol = result.idol;
      var res = result.idol.displayName.split(" ");

      that.idolProfile.child(idol.uid).set({
        email: idol.email,
        photo: idol.photoURL,
        idolname: idol.displayName,
        name:{
          first: res[0],
          middle: res[1],
          last: res[2],

        },
      });

    }
   }).catch(function(error){
     console.log(error);
   });
  }


}

export class FirebaseProvider {
 
  constructor(public afd: AngularFireDatabase) { }
 
}