import { Component,NgZone } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()

export class SubjectProvider {

  private _subjUID:string;

  constructor(public http: Http, public zone:NgZone) {
  }

  getsubjUID():string {
    return this._subjUID;

  }

  setSubjUID(inpUID){
    this._subjUID = inpUID;
    console.log("setSubjUID:",this._subjUID);
  }

}
