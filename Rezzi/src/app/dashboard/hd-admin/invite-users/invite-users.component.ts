import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../../rezzi.service'; 
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.css']
})

export class InviteUsersComponent implements OnInit {

  // Class variables
  errorMsg: string;

  constructor(private rezziService: RezziService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    // Initialize class variables
    this.rezziService.getSession().then((__session) => {

    })
    this.errorMsg = '';
  }

  initiateRAInvite(){
    const emailList = (document.getElementById('RAEmails') as HTMLInputElement).value;

    //get the selected floor
    //get the Rezzi the HD belongs to

    // Body of the HTTP request (param names MUST match input field form names expected in login.js)
    const body = {
      emailList: `${emailList}`,
      //floor: `${floor}`,
      accountType: `1`,
      //channels: 
    };

    //TO DO: what should I be doing response wise here?
    this.http.post('/invite-users', body).toPromise().then((response) => {
      const res = response as any;
      
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        const res2 = error as any;
        
      } else {
        document.getElementById('fplink').classList.add('vspace');
        document.getElementById('error-msg').hidden = false;
        this.errorMsg = `${res.error}`;
      }
    });
  }

  initiateResidentInvite(){
    const emailList = (document.getElementById('RAEmails') as HTMLInputElement).value;
    const emailarr = emailList.split(",");
  }

}
