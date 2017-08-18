import { SearchProvider } from '../../providers/search-service/search-service';
import { Component, NgZone, OnInit, Injectable } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { FirebaseListObservable } from 'angularfire2/database';

import firebase from 'firebase';
import { IdolServiceProvider } from '../../providers/idol-service/idol-service';
import { LoginPage } from '../login/login';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth';
import { TempProfilePage } from '../temp-profile/temp-profile';
import { SubjectProvider } from '../../providers/subject-service/subject-service';


@Component({
  selector: 'page-about',
  templateUrl: 'search.html',
  providers: [SearchProvider]
})

@Injectable()
export class SearchPage implements OnInit {
  searchQuery: string = '';
  newItem = '';
  image: any;
  public items = new Array();
  public idolArray = new Array();
  public scrollItems = new Array();
  public displayItems = new Array(); //not sure about this one yet
  public followData: any = {};
  followStatus: string;
  idolUID: string;
  refQuery = firebase.database().ref("idols").orderByKey();

  public counter: any;
  public arrLength: any;


  constructor(public navCtrl: NavController, public searchProvider: SearchProvider,
    public af: AngularFireModule, public zone: NgZone, public navParams: NavParams,
    private _subjectProvider: SubjectProvider) {

  }



  //Initiate at Start of page
  ngOnInit() {
    this.setIdols(this.refQuery);
    this.promiseArray();
  }
  
  setIdols(refQuery) {
    this.items = this.searchProvider.setRef(refQuery);
  }

  //Initiate Idol Array so that it doesnt get pushed multiple times
  getIdolArray() {
    this.idolArray = this.items;
    return this.idolArray;
  }

  //generate first 5 members of the search list that is going to be displayed.
  initialList() {
    console.log("im in initial list");
    console.log("this.arrLength 63",this.arrLength);
    if (this.arrLength >= 8) {
      console.log("intial list, im in if");
      for (let i = 0; i < 8; i++) {
        console.log("im in initial list if");
        this.scrollItems.push(this.idolArray[this.scrollItems.length]);
        this.counter--;
        console.log("counter at line 70",this.counter);
      }
    }

    else {
      console.log("intial list, im in else");
      for (let i = 0; i < this.arrLength; i++) {
        console.log("im in initial list else");
        this.scrollItems.push(this.idolArray[this.scrollItems.length]);

      }
    }
  }

//make sure that the idolsArr is generated before assigning the counter a value.
  promiseArray() {
    const promise = new Promise((resolve, reject) => {
      resolve(this.getIdolArray());
    })
    promise.then((res) => {
      console.log("this.idolarray line 91", this.idolArray);
      this.arrLength = this.items.length;
      this.counter = this.arrLength;
      this.initialList();
      console.log("this.counter:", this.counter);
    })
    promise.catch((err) => {
    });
  }

//load scroll contents
  loadContents(event) {
    console.log("load started");
    setTimeout(() => {
      if ((this.counter / 8) >= 1) {
        for (let i = 0; i < 8; i++) {
          this.scrollItems.push(this.idolArray[this.scrollItems.length]);
          this.counter--;
        }
        //if at end of list (length) return false

        console.log("load ended");
        event.complete();
      }
      else {
        if (this.counter > 0) {
          console.log("else counter:", this.counter);
          var tempCounter = this.counter;
          for (let i = 0; i < tempCounter; i++) {
            console.log("i 124",i);
            this.scrollItems.push(this.idolArray[this.scrollItems.length]);
            console.log("length scrollItems 121",this.scrollItems.length);
            this.counter--;
            console.log("counter 122",this.counter);
          }
          event.complete();

        }
        else {
          event.complete();
          event.enable(false);
        }
      }
    }, 500)

  }

  //Adding function to follow button
  followButtonFunc(idolKey: any, data: any) {
    this.searchProvider.followButtonFunc(idolKey, data);
  }

  navTempProf(inpUID) {
    this._subjectProvider.setSubjUID(inpUID);
    this.navCtrl.push(TempProfilePage);
  }

  setFollowStyle(key) {
    var color: string = this.searchProvider.setFollowColor(key);
    this.followStatus = this.searchProvider.setFollowStatus(key);
    return color;
  }

  // setdisplayItems(){
  //   this.displayItems =
  // }

  //Search Function
  getItems(ev: any) {
    this.getIdolArray();
    this.counter= this.getIdolArray.length;
    this.scrollItems = this.getIdolArray();
    console.log("scroll items",this.scrollItems);
    console.log("getidolarray:",this.getIdolArray());
    console.log("this.counter 167:",this.counter);
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.scrollItems = this.scrollItems.filter((item, username) => {
        return (item.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      console.log(this.scrollItems);
    }
  }

}
