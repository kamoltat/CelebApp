import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  public notifItems: any = {};


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initNotifItems();
  }

  initNotifItems() {
    this.notifItems = [
      { name: 'Yasuo', source: 'img/yasuo.png', splash: 'img/yasuospl.jpg', status: 'The Unforgiven', 
      action:'has posted a new quest!', notifImg:'' },
      { name: 'Xayah', source: 'img/xayah.jpg', splash: 'img/xayahspl.jpg', status: 'The Rebel', 
      action:'has posted a new image.', notifImg:'portrait-xayah.png' },
      { name: 'Rakan', source: 'img/rakan.jpg', splash: 'img/rakanspl.jpg', status: 'The Charmer', 
      action:'is currently broadcasting.', notifImg:'' }
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

}
