import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams,ToastController, App } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service'
import firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {ProfilePage} from '../profile/profile';
import {AngularFireDatabase} from 'angularfire2/database';
import {HomePage} from '../home/home';
import {TabsPage} from '../tabs/tabs';


@Component({
  selector: 'page-create-profile',
  templateUrl: 'create-profile.html',
  providers: [AngularFireAuth]
})
export class CreateProfilePage {
    profile = {} as ProfilePage;
  constructor(public navCtrl: NavController, 
  public userProvider: UserServiceProvider, 
  public afAuth: AngularFireAuth, 
  private toastCtrl: ToastController, private afDatabase: AngularFireDatabase, private appCtrl: App) {
}
createProfile(){
    this.afAuth.authState.take(1).subscribe(auth => {
        this.afDatabase.object("profile/"+auth.uid).set(this.profile)
        .then(() => this.navCtrl.push(TabsPage))
    
    });
}   


}
