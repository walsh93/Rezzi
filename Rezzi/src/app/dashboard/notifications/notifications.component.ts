import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../rezzi.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  // Class variables
  errorMsg: string;
  session: any;
  panelOpenState = false;
  panelInfo: Array<any>;

  constructor(private rezziService: RezziService,
              private router: Router,
              private http: HttpClient,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.errorMsg = '';

    this.rezziService.getSession().then((session) => {
        this.session = session;
    });

    this.rezziService.getNotifications().then(panelInfo => {
      if (panelInfo == null) {
        console.log('Panel info does not exist');
        return;
      } else {
        this.panelInfo = panelInfo.panelInfo;
      }
    });
  }

  dismissNotification(channel: string, toDismiss: string) {


    console.log('Notification to be dismissed: ' + toDismiss);
    const body = {
      toDismiss,
      channel
    };

    this.http.post('/dismiss-notification', body).toPromise().then((response) => {
      location.reload();
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        this.snackBar.open(res.error.text);  // an alert is blocking, so the subsequent code will only run once alert closed
        location.reload();
      } else {
        this.snackBar.open(`There was an error while trying to dismiss notification. Please try again later.`);
      }
    });
  }

  muteNotifications(channel: string) {


    console.log('Channel to be muted: ' + channel);
    const body = {
      channel
    };

    this.http.post('/mute-notifications', body).toPromise().then((response) => {
      location.reload();
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        this.snackBar.open(res.error.text);  // an alert is blocking, so the subsequent code will only run once alert closed
        location.reload();
      } else {
        this.snackBar.open(`There was an error while trying to mute channel. Please try again later.`);
      }
    });
  }

  }
