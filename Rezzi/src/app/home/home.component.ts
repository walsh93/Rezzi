import { Component, OnInit } from '@angular/core';
import { RezziService } from '../rezzi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private rezziSrv: RezziService, private router: Router) { }

  /**
   * Get session data and determine whether or not you need to reroute
   * If the service is not called here, then if someone clicks a button to the Home page without
   * manually putting it in, the middleware function in permissions.js won't run
   *
   * IMPORTANT: This is the highest component in the hierarchy, so if this one handles the sign-in
   * redirect, none of the CHILD components have to. But if we get rid of it here, then we have to
   * add it to all the CHILD components.
   */
  ngOnInit() {
    this.rezziSrv.getSession().then((response) => {
      if (response.email == null) {  // not signed in
        this.router.navigate(['/sign-in']);
      } else if (response.verified === false) {  // signed in but not verified
        this.router.navigate(['/sign-up']);
      } else if (response.tempPword === true) { // needs to reset password
        this.router.navigate(['/pword-reset-change']);
      }  // else signed in and verified
    });
  }

}
