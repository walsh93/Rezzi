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
  showNotify = false;
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
    this.showNotify = false;
  }

  showPrivateMessages() {
    this.showEdit = false;
    this.showPM = true;
    this.showRA = false;
    this.showHD = false;
    this.showReqChan = false;
    this.showPostPriv = false;
    this.showNotify = false;
  }

  showRequestChannel() {
    this.showEdit = false;
    this.showPM = false;
    this.showRA = false;
    this.showHD = false;
    this.showReqChan = true;
    this.showPostPriv = false;
    this.showNotify = false;
  }

  showRaAdmin() {
    this.showEdit = false;
    this.showPM = false;
    this.showRA = true;
    this.showHD = false;
    this.showReqChan = false;
    this.showPostPriv = false;
    this.showNotify = false;
  }

  showHdAdmin() {
    this.showEdit = false;
    this.showPM = false;
    this.showRA = false;
    this.showHD = true;
    this.showReqChan = false;
    this.showPostPriv = false;
    this.showNotify = false;
  }

  showPostingPrivileges() {
    this.showEdit = false;
    this.showPM = false;
    this.showRA = false;
    this.showHD = false;
    this.showReqChan = false;
    this.showPostPriv = true;
    this.showNotify = false;
  }

  showNotifications() {
    this.showEdit = false;
    this.showPM = false;
    this.showRA = false;
    this.showHD = false;
    this.showReqChan = false;
    this.showPostPriv = false;
    this.showNotify = true;
  }

}
