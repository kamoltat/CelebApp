import { Component, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchPage } from '../search/search';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { TempProfilePage } from '../temp-profile/temp-profile';
import { SubjectProvider } from '../../providers/subject-service/subject-service';
import firebase from 'firebase';

@Component({
  templateUrl: 'tabs.html'
})
@Injectable()
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SearchPage;
  tab3Root = ProfilePage;

  constructor() {

  }


}
