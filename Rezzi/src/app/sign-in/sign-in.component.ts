import { Component, OnInit } from '@angular/core';
import { RezziService } from '../rezzi.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;


  constructor(private rezziService: RezziService, private router: Router, private _formBuilder: FormBuilder) { }

  /**
   * Get session data and determine whether or not you need to reroute
   * If the service is not called here, then if someone clicks a button to the Sign In page without
   * manually putting it in, the middleware function in permissions.js won't run
   */
  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.rezziService.getSession().then((response) => {
      if (response.email != null) {  // already signed in
        if (response.tempPword === true) {  // user has temp password; needs to redirect to change password
          this.router.navigate(['/pword-reset-change']);
        }
        if (response.verified === true) {  // already registered
          this.router.navigate(['/home']);
        } else {  // not yet registered
          this.router.navigate(['/sign-up']);
        }
      }  // else you are not yet signed in
    });
  }

}
