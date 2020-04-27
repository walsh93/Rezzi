import { Component, OnInit } from '@angular/core';
import { RezziService } from '../rezzi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  showEdit = true;
  showPM = false;
  showRA = false;
  showHD = false;
  showReqChan = false;
  showPostPriv = false;
  accountType: number;

  // Data to pass to child elements
  email: string;
  rezzi: string;

  constructor(private rezziService: RezziService, private router: Router) { }

  ngOnInit() {
    this.rezziService.getSession().then((response) => {
      if (response.email == null) {  // not signed in
        this.router.navigate(['/sign-in']);
      } else if (response.verified === false) {  // signed in but not verified
        this.router.navigate(['/sign-up']);
      } else {
        this.email = response.email;
        this.rezzi = response.rezzi;
        this.accountType = response.accountType;

        const query = window.location.search;
        const urlParam = new URLSearchParams(query);
        if (urlParam.get('nav') === 'pm') {
          this.showPrivateMessages();
        }

        switch (urlParam.get('nav')) {
          case 'pm': {
            this.showPrivateMessages();
            break;
          }
          case 'ra': {
            this.showRaAdmin();
            break;
          }
          case 'hd': {
            this.showHdAdmin();
            break;
          }
          case 'post': {
            this.showPostingPrivileges();
            break;
          }
          case 'req': {
            this.showRequestChannel();
            break;
          }
        }

        if (response.accountType == null || response.accountType === undefined) {
          this.accountType = 2;  // Set as resident by default??
        }
      }
    });
  }

  showEditProfile() {
    this.showEdit = true;
    this.showPM = false;
    this.showRA = false;
    this.showHD = false;
    this.showReqChan = false;
    this.showPostPriv = false;
  }

  showPrivateMessages() {
    this.showEdit = false;
    this.showPM = true;
    this.showRA = false;
    this.showHD = false;
    this.showReqChan = false;
    this.showPostPriv = false;
  }

  showRequestChannel() {
    this.showEdit = false;
    this.showPM = false;
    this.showRA = false;
    this.showHD = false;
    this.showReqChan = true;
    this.showPostPriv = false;
  }

  showRaAdmin() {
    this.showEdit = false;
    this.showPM = false;
    this.showRA = true;
    this.showHD = false;
    this.showReqChan = false;
    this.showPostPriv = false;
  }

  showHdAdmin() {
    this.showEdit = false;
    this.showPM = false;
    this.showRA = false;
    this.showHD = true;
    this.showReqChan = false;
    this.showPostPriv = false;
  }

  showPostingPrivileges() {
    this.showEdit = false;
    this.showPM = false;
    this.showRA = false;
    this.showHD = false;
    this.showReqChan = false;
    this.showPostPriv = true;
  }

}
