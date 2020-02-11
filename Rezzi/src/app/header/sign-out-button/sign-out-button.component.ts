import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-out-button',  // This is the name of this component's HTML tag
  templateUrl: './sign-out-button.component.html',
  styleUrls: ['./sign-out-button.component.css']
})
export class SignOutButtonComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  /**
   * Send GET request
   * Regardless of whether there was an error or not, the return object can be cast to an HttpErrorResponse
   * If logout succeeded (got a 2XX response status from sign-in.js), the then() will execute
   * If logout failed (got a 4XX response status from sign-in.js), the catch() will execute
   * Sometimes there is a parsing error in the browser, so a successful login is still "caught"
   */
  signOut() {
    this.http.get('/sign-out').toPromise().then((response) => {
      this.router.navigate(['/sign-in']);
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        this.router.navigate(['/sign-in']);
      }
    });
  }

}
