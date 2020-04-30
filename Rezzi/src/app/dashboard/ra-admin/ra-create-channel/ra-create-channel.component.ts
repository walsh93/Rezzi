import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../../rezzi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ra-create-channel',
  styleUrls: ['./ra-create-channel.component.css'],

  // Pass data to child via data binding (replaces templateUrl and the HTML file)
  template: `
    <div class="container">
      <h1 style="
      margin: auto;
      display: block;
      margin-left: auto;
      margin-right: auto;
      text-align: center;">Let's create a new channel!</h1>
      <app-create-channel-form [owner]="owner"></app-create-channel-form>
    </div>
  `
})
export class RaCreateChannelComponent implements OnInit {

  owner: string;

  constructor(private rezziService: RezziService, private router: Router) { }

  /**
   * Get session data and determine whether or not you need to reroute
   * If the service is not called here, then if someone clicks a button to the Sign In page without
   * manually putting it in, the middleware function in permissions.js won't run
   */
  ngOnInit(): void {
    this.rezziService.getSession().then((response) => {
      if (response.email == null) {  // not signed in
        this.router.navigate(['/sign-in']);
      } else if (response.accountType !== 1 && response.accountType !== 0) {  // not an RA or HD
        this.router.navigate(['/err/1/unauthorized']);
      } else {  // else you are a signed-in RA
        this.owner = response.email;
      }
    });
  }

}
