import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,LoadingController, AlertController, 
ToastController, } from 'ionic-angular';
import {RegisterPage} from '../register/register';
import {ResetPasswordPage} from '../reset-password/reset-password';
import {UserServiceProvider} from '../../providers/user-service/user-service';
import {HomePage} from '../home/home';
import {CreateProfilePage} from '../create-profile/create-profile';
import { SignupIdolPage } from '../signup-idol/signup-idol';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers:[UserServiceProvider]
})
export class LoginPage {
  public emailField: any;
  public passwordField: any;
  public users = [];
  public usersList : any;


  constructor(public navCtrl: NavController, public navParams: NavParams, 
  public modalCtrl: ModalController, public usersService: UserServiceProvider,
  public loadingCtrl:LoadingController, public AlertCtrl:AlertController,
  public toastCtrl: ToastController) {
  this.emailField = "juniorsirivadhna@gmail.com";
  }

  
  submitLogin(){
    this.usersService.loginUser(this.emailField, this.passwordField).then(authData => {
      //successful
    this.navCtrl.setRoot(HomePage);
    }, error =>{
      //alert("error logging in: " +error.message);
      let alert = this.AlertCtrl.create({
      title: 'Error Log in',
      subTitle: error.message,
      buttons: ['OK']
    });
    alert.present();
    this.navCtrl.setRoot(LoginPage);
    });
    let loader = this.loadingCtrl.create({
      dismissOnPageChange:true,
    });
    loader.present();
    
  }
  
  submitIdolRegister(){
    let registerModal = this.modalCtrl.create(SignupIdolPage);
    registerModal.present();
  }

  submitRegister(){
    let registerModal = this.modalCtrl.create(RegisterPage);
    registerModal.present();
  }
  redirectToResetPage(){
    let prompt = this.AlertCtrl.create({
      title: 'Enter Your Email',
      message: "A new password will be sent to you",
      inputs: [
        {
          name: 'recoverEmail',
          placeholder: 'you@example.com'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {
            let loading = this.loadingCtrl.create({
            dismissOnPageChange:true,
            content: 'Reseting your password..'
            });
            loading.present();
            //call userservice
            this.usersService.forgotPasswordUser(data.recoverEmail).then(() => {
              loading.dismiss().then(() => {
                //show pop up
                let alert = this.AlertCtrl.create({
                        title: 'Check your email',
                        subTitle: 'Password reset successful',
                        buttons: ['OK']
                      });
                      alert.present(); 

              })
            },error =>{
              //alert("error logging in: " +error.message);
              loading.dismiss().then(() => {
                        let alert = this.AlertCtrl.create({
                        title: 'Error resetting password',
                        subTitle: error.message,
                        buttons: ['OK']
                      });
                      alert.present(); 
                 });
                 })
          }
        } 
      ]
    });
    prompt.present();
  }

  googleSignIn(){
    this.usersService.googleSignInUser().then(() =>{
        let toast = this.toastCtrl.create({
          message: 'User account created successfully...',
          duration: 3000
        })
    });
  }

  

   
    

  

 
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
