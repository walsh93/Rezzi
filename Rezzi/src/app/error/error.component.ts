import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  // Class properties
  message: string;
  defMsg = 'An unknown error has occurred. Please try again later.';
  permission = {
    not_raadmin: 'You are not an RA Admin, you do not have permission to view this page',
    not_hdadmin: 'You are not an HD Admin, you do not have permission to view this page',
  };

  /**
   * https://angular.io/guide/router#activated-route
   * https://medium.com/better-programming/angular-6-url-parameters-860db789db85
   */
  constructor(private route: ActivatedRoute, private router: Router) { }

  /**
   * Check parameters of URL to determine what error message should be displayed
   */
  ngOnInit() {
    const paramMap = this.route.snapshot.paramMap;
    if (paramMap.has('accountType')) {  // Permission error ("accountType" param in app-routing.module.ts)
      const acctType = paramMap.get('accountType');
      switch (acctType) {
        case '0': {
          this.message = this.permission.not_hdadmin;
          break;
        }
        case '1': {
          this.message = this.permission.not_raadmin;
          break;
        }
        default: {
          this.message = this.defMsg;
        }
      }
    } else {  // Error has not been configured yet
      this.message = this.defMsg;
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

}
