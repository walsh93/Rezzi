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

}
