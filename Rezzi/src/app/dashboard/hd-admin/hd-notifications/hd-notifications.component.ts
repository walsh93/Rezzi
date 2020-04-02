import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../../rezzi.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgForm, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-hd-notifications',
  templateUrl: './hd-notifications.component.html',
  styleUrls: ['./hd-notifications.component.css']
})
export class HdNotificationsComponent implements OnInit {

  // Class variables
  errorMsg: string;
  session: any;
  deletionRequests: Array<string>;

  panelOpenState = false;

  constructor(private rezziService: RezziService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.errorMsg = '';

    this.rezziService.getSession().then((session) => {
        this.session = session;
    });

    this.rezziService.getDeletionRequests().then(deletionRequests => {
      console.log('Deletion request list IS ' + deletionRequests.deletionRequests);
      if (deletionRequests == null) {
        this.deletionRequests = ['there are no requests'];
      } else {
        this.deletionRequests = deletionRequests.deletionRequests;
      }
    });

  }

  deleteUser(email: string) {
    const confirmedDelete = confirm(`Are you sure you would like to approve the deletion of the account ${email}?`);
    if (!confirmedDelete) {
      return;
    }

    console.log('Email to be deleted: ' + email);
    const body = {
      email,
      hdemail: this.session.email,
      rezzi: this.session.rezzi
    };

    this.http.post('/deleteUser', body).toPromise().then((response) => {
      location.reload();
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        alert(res.error.text);  // an alert is blocking, so the subsequent code will only run once alert closed
        location.reload();
      } else {
        alert(`There was an error while trying to delete this user (${res.status}). Please try again later.`);
      }
    });

  }

}
