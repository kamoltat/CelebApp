import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,LoadingController,AlertController} from 'ionic-angular';
import { IdolServiceProvider } from '../../providers/idol-service/idol-service';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-signup-idol',
  templateUrl: 'signup-idol.html',
})
export class SignupIdolPage {
  public emailField: any;
  public passwordField: any;
  public usernameField: any;
  public firstnameField: any;
  public lastnameField: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public ViewCtrl: ViewController,public usersService: IdolServiceProvider
  ,public loadingCtrl:LoadingController,public AlertCtrl:AlertController) {
  }

  closeRegisterPage(){
    this.ViewCtrl.dismiss();
  }

  signIdolUp(){
    
    this.usersService.signUpIdol(this.emailField, this.passwordField,this.usernameField,this.firstnameField,this.lastnameField).then(authData => {
      //successful
    this.navCtrl.setRoot(HomePage);
    }, error =>{
     //alert("error logging in: " +error.message);
  
    });
    let loader = this.loadingCtrl.create({
      dismissOnPageChange:true,
    });
    loader.present();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupIdolPage');
  }

}
