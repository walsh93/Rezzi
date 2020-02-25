import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.css']
})
export class SignInFormComponent implements OnInit {

  // Class variables
  errorMsg: string;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    // Initialize class variables
    this.errorMsg = '';
  }

  signIn() {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    // Body of the HTTP request (param names MUST match input field form names expected in login.js)
    const body = {
      email: `${email}`,
      password: `${password}`
    };

    /**
     * Send POST request
     * Regardless of whether there was an error or not, the return object can be cast to an HttpErrorResponse
     * If login succeeded (got a 2XX response status from sign-in.js), the then() will execute
     * If login failed (got a 4XX response status from sign-in.js), the catch() will execute
     * Sometimes there is a parsing error in the browser, so a successful login is still "caught"
     * NOTE: Anything returned from sign-in.js will be accessible in res.error
     */
    this.http.post('/sign-in', body).toPromise().then((response) => {
      const res = response as any;
      //TO DO: so this routing doesnt owrk for pword reset???? Idk why gotta fix that
      if (res.tempPword === true) {
        this.router.navigate(['/pword-reset-change']);
      } else if (res.verified === false) {
        this.router.navigate(['/sign-up']);
      } else {
        this.router.navigate(['/home']);
      }
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        const res2 = error as any;
        if (res2.error.verified === false) {
          this.router.navigate(['/sign-up']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        document.getElementById('fplink').classList.add('vspace');
        document.getElementById('error-msg').hidden = false;
        this.errorMsg = `${res.error}`;
      }
    });
  }

}
