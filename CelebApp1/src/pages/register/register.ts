import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,LoadingController,AlertController} from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service';
import {HomePage} from '../home/home';
import {TabsPage} from '../tabs/tabs';
import {CreateProfilePage} from '../create-profile/create-profile'
/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers:[UserServiceProvider]
})

export class RegisterPage {
  public emailField: any;
  public passwordField: any;
  public picture: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public ViewCtrl: ViewController,public usersService: UserServiceProvider
  ,public loadingCtrl:LoadingController,public AlertCtrl:AlertController) {
  }
  closeRegisterPage(){
    this.ViewCtrl.dismiss();
  }

  signUserUp(){
    
    this.usersService.signUpUser(this.emailField, this.passwordField).then(authData => {
      //successful
    this.navCtrl.push(CreateProfilePage);
    }, error =>{
      //alert("error logging in: " +error.message);
  
    });
    let loader = this.loadingCtrl.create({
      dismissOnPageChange:true,
    });
    loader.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }


}
