import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';



/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserServiceProvider {

public data: any;
public fireAuth:any;
public userProfile: any;
public is_celeb: boolean;

  constructor(public http: Http) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('users');
    
    console.log('Hello UserServiceProvider Provider');
  }



signUpUser(email: string,password: string,username: string,firstname:string,lastname:string): any{
  return this.fireAuth.createUserWithEmailAndPassword(email, password).
  then((newUser) => {
    //sign in the user
      return this.fireAuth.signInWithEmailAndPassword(email, password).then((
      authenticatedUser) => {
        //sucessfully login, create user profile
        return this.userProfile.child(authenticatedUser.uid).set({
          email:email,
          password: password,
          username: username,
          firstname: firstname,
          lastname: lastname,
          about: "",
          profile_pic_url: "image/default_profile/default_profile_pic.jpg"
        });
      });
  });
}
loginUser(email: string, password: string): any{
  console.log("loginUser")
  return this.fireAuth.signInWithEmailAndPassword(email, password);
}
logoutUser(): firebase.Promise<any>{
  console.log("in logoutUser()")
  if(firebase.auth().currentUser){
  firebase.database().ref('/users').child(firebase.auth().currentUser.uid).off();
  return this.fireAuth.signOut();
  }
  else{

  }
  //redirection
}



 forgotPasswordUser(email:any){
    return this.fireAuth.sendPasswordResetEmail(email);
  }
  googleSignInUser(){
   var provider = new firebase.auth.GoogleAuthProvider();
   provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

   var that = this;
   return firebase.auth().signInWithPopup(provider).then(function(result){
    if(result.user){
      var user = result.user;
      var res = result.user.displayName.split(" ");

      that.userProfile.child(user.uid).set({
        email: user.email,
        photo: user.photoURL,
        username: user.displayName,
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