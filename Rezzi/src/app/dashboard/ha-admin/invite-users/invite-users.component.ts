import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../../rezzi.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.css']
})

export class InviteUsersComponent implements OnInit {

  // Class variables
  errorMsg: string;

  constructor(private rezziService: RezziService, private router: Router) { }

  ngOnInit() {
    // Initialize class variables
    this.rezziService.getSession().then((__session) => {

    })
    this.errorMsg = '';
  }

  initiateRAInvite(){
    const emailList = (document.getElementById('RAEmails') as HTMLInputElement).value;
    const emailarr = emailList.split(",");

    //get the selected floor
    //get the Rezzi the HD belongs to

    // // Body of the HTTP request (param names MUST match input field form names expected in login.js)
    // const body = {
    //   emailarr: `${emailarr}`,
    //   password: `${password}`,
    //   rezzi: `${rezzi}`, 
    //   floor: `${floor}`,
    //   accountType: 1
    // };

    // /**
    //  * Send POST request
    //  * Regardless of whether there was an error or not, the return object can be cast to an HttpErrorResponse
    //  * If login succeeded (got a 2XX response status from invite-user.js), the then() will execute
    //  * If login failed (got a 4XX response status from invite-user.js), the catch() will execute
    //  * Sometimes there is a parsing error in the browser, so a successful login is still "caught"
    //  * NOTE: Anything returned from invite-user.js will be accessible in res.error
    //  */
    //  TO DO: start here!
    // this.http.post('/invite-user', body).toPromise().then((response) => {
    //   const res = response as any;
    //   if (res.verified === false) {
    //     this.router.navigate(['/sign-up']);
    //   } else {
    //     this.router.navigate(['/home']);
    //   }
    // }).catch((error) => {
    //   const res = error as HttpErrorResponse;
    //   if (res.status === 200) {
    //     const res2 = error as any;
    //     if (res2.error.verified === false) {
    //       this.router.navigate(['/sign-up']);
    //     } else {
    //       this.router.navigate(['/home']);
    //     }
    //   } else {
    //     this.errorMsg = `${res.error}`;
    //   }
    // });
  }

  initiateResidentInvite(){
    const emailList = (document.getElementById('RAEmails') as HTMLInputElement).value;
    const emailarr = emailList.split(",");
  }

}
