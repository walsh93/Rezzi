import { Component, OnInit } from '@angular/core';
import {RezziService} from '../../rezzi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  constructor() {}

  ngOnInit():void {
    // this.rezziService.getSession().then((response) => {
    //   if (response.email == null) {  // not signed in
    //     this.router.navigate(['/sign-in']);
    //   } else if (response.verified === false) {  // signed in but not verified
    //     this.router.navigate(['/sign-up']);
    //   }  // else signed in and verified
    // });
  }
}
