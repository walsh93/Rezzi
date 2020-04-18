import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../../rezzi.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgForm, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.css']
})

export class InviteUsersComponent implements OnInit {

  // Class variables
  errorMsg: string;
  session: any;
  floors: Array<string>;

  // Form control
  selectedRaFloor: string;
  raFloorControl = new FormControl('', Validators.required);
  selectedResFloor: string;
  resFloorControl = new FormControl('', Validators.required);

  constructor(private rezziService: RezziService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    // Initialize class variables
    this.errorMsg = '';
    this.selectedRaFloor = '';
    this.selectedResFloor = '';

    this.rezziService.getSession().then((session) => {
        this.session = session;
    });

    this.rezziService.getFloors().then((floorList) => {
      console.log(`FLOOR LIST IS ${floorList}`);
      if (floorList == null) {
        this.errorMsg = 'Failed to retrieve floors.';
      } else {
        this.floors = floorList.floors;
      }
    });

    // For testing (ie. on `ng serve`)
    // this.floors = new Array<string>();
    // this.floors.push('3S');
    // this.floors.push('2N');
  }

  onRAInvite(form: NgForm) {
    if (form.invalid || this.selectedRaFloor.length === 0) {
      return;
    }
    const emailList = form.value.RAEmails;
    console.log("List of RAs invited on " + this.selectedRaFloor + " ", emailList,)

    // make array of channels that user will be added to
    const channelList = ['hallwide-General', 'floors-' + this.selectedRaFloor + '-General', 'RA-General'];

    // Body of the HTTP request (param names MUST match input field form names expected in login.js)
    const body = {
      emailList: form.value.RAEmails,
      floor: this.selectedRaFloor,
      rezzi: this.session.rezzi,
      accountType: `1`,
      channels: channelList
    };
    this.addInvite(body);
  }

  onResidentInvite(form: NgForm) {
    if (form.invalid || this.selectedResFloor.length === 0) {
      return;
    }
    const emailList = form.value.residentEmails;

    // make array of channels that user will be added to
    const channelList = ['hallwide-General', 'floors-' + this.selectedResFloor + '-General'];

    // Body of the HTTP request (param names MUST match input field form names expected in login.js)
    const body = {
      emailList: form.value.residentEmails,
      floor: this.selectedResFloor,
      rezzi: this.session.rezzi,
      accountType: `2`,
      channels: channelList
    };
    this.addInvite(body);
  }

  /**
   * Send POST request
   * Regardless of whether there was an error or not, the return object can be cast to an HttpErrorResponse
   * If login succeeded (got a 2XX response status from invite-users.js), the then() will execute
   * If login failed (got a 4XX response status from invite-users.js), the catch() will execute
   * Sometimes there is a parsing error in the browser, so a successful login is still "caught"
   * NOTE: Anything returned from invite-users.js will be accessible in res.error
   */
  addInvite(list) {
    this.http.post('/invite-users', list).toPromise().then((response) => {
      alert('Your emails are being processed and sent');
      location.reload();
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        alert(res.error.text);  // an alert is blocking, so the subsequent code will only run once alert closed
        location.reload();
      } else {
        alert('There was an error when sending the emails. Please try again later.');
      }
    });
  }

}
