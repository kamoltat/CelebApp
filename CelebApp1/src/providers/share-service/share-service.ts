import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import firebase from 'firebase';
import 'rxjs/add/operator/map';

/*
  Generated class for the ShareServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ShareServiceProvider {
  public commentList;
  public postList;


  constructor(public http: Http, public zone:NgZone) {
    console.log('Hello ShareServiceProvider Provider');
    this.commentList = Array();
    this.postList = new Array();
    

  }

//------------------------------------Posts Section-------------------------------


setPostsByFollowingId(){
  var user = firebase.auth().currentUser;
  firebase.database().ref("following/"+user.uid).on('value',snapshot => {
    snapshot.forEach(childSnapshot =>{
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    this.setPost(childKey);
    // this.updatePosts(childKey);
    return false;
    });
  });
}

setPost(e){
// var user = firebase.auth().currentUser;
firebase.database().ref("posts/"+e).orderByChild("timeStamp").once('value',snapshot => {
      snapshot.forEach(element => {
      this.postList.pop();  
      return false;
    });
    
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
  childData.uid = e;
  this.postList.push(childData);

  console.log(this.postList)
  return false;
    }); 

  })
  
}

getPosts(){
  console.log("getPosts", this.postList)
  return this.postList;
  
}





//-------------------------------------Comment Section-------------------
updateCommentCount(intArray,bool){
  console.log("which Post",this.postList[intArray]);

}

setCommentPosts(postuid,postid){
var user = firebase.auth().currentUser;
var postRef = firebase.database().ref("posts/"+postuid+"/"+postid+"/comments");
postRef.once('value').then(snapshot => {
snapshot.forEach(childSnapshot =>{
var childKey = childSnapshot.key;
var childData = childSnapshot.val();
console.log("childData:",childData);
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
  childData.timeStamp = new Date(childData.timeStamp).toLocaleDateString();
  childData.key = childKey;
  this.commentList.push(childData);
  
  console.log(this.commentList);
    }); 
  }).catch(e => {
    console.log(e);
  });

}

getCommentPost(){
  return this.commentList;
}
//------------------------------------------------------------------------


}

