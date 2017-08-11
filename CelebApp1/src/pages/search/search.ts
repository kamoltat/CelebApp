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
  public idolArray: any;
  public followData: any = {};
  followStatus: string;
  idolUID: string;
  refQuery = firebase.database().ref("idols").orderByKey();

  constructor(public navCtrl: NavController, public searchProvider: SearchProvider,
    public af: AngularFireModule, public zone: NgZone, public navParams: NavParams,
    private _subjectProvider: SubjectProvider) {

  }

  setIdols(refQuery) {
    this.items = this.searchProvider.setRef(refQuery);
  }

  //Initiate Idol Array so that it doesnt get pushed multiple times
  getIdolArray() {
    this.idolArray = this.items;
  }

  //Initiate at Start of page
  ngOnInit() {
    this.setIdols(this.refQuery);
    this.getIdolArray();
    console.log(this.idolArray);
  }

  // ionViewWillLoad() {}

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

  //Search Function
  getItems(ev: any) {
    this.getIdolArray();
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.idolArray = this.idolArray.filter((item, username) => {
        return (item.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
