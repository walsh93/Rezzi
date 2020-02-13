import { Component, OnInit } from '@angular/core';
import { RezziService } from '../rezzi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(private rezziService: RezziService, private router: Router) { }

  /**
   * Get session data and determine whether or not you need to reroute
   * If the service is not called here, then if someone clicks a button to the Sign In page without
   * manually putting it in, the middleware function in permissions.js won't run
   */
  ngOnInit() {
    this.rezziService.getSession().then((response) => {
      if (response.email != null) {
        this.router.navigate(['/home']);
      }
    });
  }

}
