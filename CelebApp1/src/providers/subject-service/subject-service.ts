import { Component,NgZone } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()

export class SubjectProvider {

  private _subjUID:string;
  private subjectPostList;

  constructor(public http: Http, public zone:NgZone) {
  }

  getsubjUID():string {
    return this._subjUID;

  }

  setSubjUID(inpUID){
    this._subjUID = inpUID;
    console.log("setSubjUID:",this._subjUID);
  }

  getSubjectPosts(){
  return this.subjectPostList;
  
}
  setSubjectPosts(subjectID){
  this.subjectPostList = new Array();
  console.log("I'm in setSubjectPosts")
  var subjectPostsRef = firebase.database().ref("posts/"+subjectID);
  subjectPostsRef.once('value', snapshot => {
    snapshot.forEach(childSnapshot =>{
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    firebase.storage().ref().child(childData['authorPicUrl'].toString()).getDownloadURL().then((url)=> 
  {
    this.zone.run(()=>{
    childData['authorPicUrl'] = url;
    }).catch(e => {
    console.log(e);
  });
  }).catch(e => {
    console.log(e);
  });
  if(childData['post_pic_url'] != ""){
  firebase.storage().ref().child(childData['post_pic_url'].toString()).getDownloadURL().then((data) => 
  {
    this.zone.run(()=>{

    childData['post_pic_url'] = data;
    }).catch(e => {
    console.log(e);
  });
  }).catch(e => {
    console.log(e);
  });
  }
  childData.timeStamp = new Date(childData.timeStamp).toLocaleDateString();
  childData.key = childKey;
  childData.uid = subjectID;
  this.subjectPostList.push(childData);
  console.log("subjectPost:",this.subjectPostList);
  return false;
    });
    
  })
}


}
