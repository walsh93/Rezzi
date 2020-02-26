import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../../rezzi.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.css']
})

export class InviteUsersComponent implements OnInit {

  // Class variables
  errorMsg: string;
  session: any;
  floors = new Array<string>();
  constructor(private rezziService: RezziService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    // Initialize class variables
    this.rezziService.getSession().then((session) => {
        this.session = session;
    });
    this.errorMsg = '';

    // Hardcoding floors for testing
    this.floors.push('3S');
    this.floors.push('2N');
  }
  onRAInvite(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const emailList = form.value.RAEmails;
    console.log(emailList);

    // get the selected floor
    // get the Rezzi the HD belongs to

    // Body of the HTTP request (param names MUST match input field form names expected in login.js)
    const body = {
      emailList: form.value.RAEmails,
      // floor: `${floor}`,
      accountType: `1`,
      // channels:
    };
    this.addInvite(body);
  }

  onResidentInvite(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const emailList = form.value.residentEmails;
    console.log(emailList);

    // get the selected floor
    // get the Rezzi the HD belongs to

    // Body of the HTTP request (param names MUST match input field form names expected in login.js)
    const body = {
      emailList: form.value.residentEmails,
      rezzi: this.session.rezzi,
      // floor: `${floor}`,
      accountType: `1`,
      // channels:
    };
    this.addInvite(body);
  }

  addInvite(list) {
    this.http.post<{notification: string}>('/invite-users', list)
    .subscribe(responseData => {
      console.log(responseData.notification);
    });
  }

    // TODO: what should I be doing response wise here?
}
