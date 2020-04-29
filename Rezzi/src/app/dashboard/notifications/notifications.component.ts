import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../rezzi.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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

  constructor(private rezziService: RezziService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.errorMsg = '';

    this.rezziService.getSession().then((session) => {
        this.session = session;
    });

    this.rezziService.getNotifications().then(panelInfo => {
      if (panelInfo == null) {
        console.log("Panel info does not exist");
        return;
      } else {
        this.panelInfo = panelInfo.panelInfo;
      }
    });
  }

  dismissNotification(channel: string, toDismiss: string) {
    

    console.log('Notification to be dismissed: ' + toDismiss);
    const body = {
      toDismiss: toDismiss,
      channel: channel
    };

    this.http.post('/dismiss-notification', body).toPromise().then((response) => {
      location.reload();
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        alert(res.error.text);  // an alert is blocking, so the subsequent code will only run once alert closed
        location.reload();
      } else {
        alert(`There was an error while trying to dismiss notification. Please try again later.`);
      }
    });
  }

  muteNotifications(channel: string) {
    

    console.log('Channel to be muted: ' + channel);
    const body = {
      channel: channel
    };

    this.http.post('/mute-notifications', body).toPromise().then((response) => {
      location.reload();
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        alert(res.error.text);  // an alert is blocking, so the subsequent code will only run once alert closed
        location.reload();
      } else {
        alert(`There was an error while trying to mute channel. Please try again later.`);
      }
    });
  }

  }
