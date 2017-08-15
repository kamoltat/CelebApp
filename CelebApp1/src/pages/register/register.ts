import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,LoadingController,AlertController, ToastController} from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service';
import {HomePage} from '../home/home';
import {TabsPage} from '../tabs/tabs';
import {CreateProfilePage} from '../create-profile/create-profile';
import {LoginPage} from '../login/login';
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
  public usernameField: any;
  public firstnameField: any;
  public lastnameField: any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public ViewCtrl: ViewController,public usersService: UserServiceProvider
  ,public loadingCtrl:LoadingController,public AlertCtrl:AlertController,
  private toastCtrl: ToastController){
  }
  
  closeRegisterPage(){
    this.ViewCtrl.dismiss();
  }

  signUserUp(){
    
  this.usersService.signUpUser(this.emailField, this.passwordField,this.usernameField,this.firstnameField,this.lastnameField).then(authData => {
      //successful
    this.ViewCtrl.dismiss()
    let toast = this.toastCtrl.create({
      message: this.emailField+ ' has registered successfully',
      duration: 3000
    });
    toast.present();
    }, error =>{
      
      let alert = this.AlertCtrl.create({
      title: 'Error Register',
      subTitle: error.message,
      buttons: ['OK']
      
    });
     alert.present();
    });
    // let loader = this.loadingCtrl.create({
    //   dismissOnPageChange:true,
    // });
    // loader.present();
  
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }


}
