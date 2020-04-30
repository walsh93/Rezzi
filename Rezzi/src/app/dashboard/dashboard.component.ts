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
  viewing = null;

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
        switch (urlParam.get('nav')) {
          case 'pm': {
            this.viewing = urlParam.get('user');
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
        window.history.replaceState({}, document.title, "/" + "dashboard");
        if (response.accountType == null || response.accountType === undefined) {
          this.accountType = 2;  // Set as resident by default??
        }
      }
    });
  }

  //all
  showEditProfile() {
    document.getElementById('editProfileBtn').style.backgroundColor = "#607d8b";
    document.getElementById('pmBtn').style.backgroundColor = "#424242";
    document.getElementById('notiBtn').style.backgroundColor = "#424242";

    if (document.getElementById('reqBtn') !== null) {
      document.getElementById('reqBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('raBtn') !== null) {
      document.getElementById('raBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('hdBtn') !== null) {
      document.getElementById('hdBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('postBtn') !== null) {
      document.getElementById('postBtn').style.backgroundColor = "#424242";
    }
    document.getElementById('dash').innerText = "Edit Profile";

    this.showEdit = true;
    this.showPM = false;
    this.showRA = false;
    this.showHD = false;
    this.showReqChan = false;
    this.showPostPriv = false;
    this.showNotify = false;
  }

  //all
  showPrivateMessages() {
    document.getElementById('editProfileBtn').style.backgroundColor = "#424242";
    document.getElementById('pmBtn').style.backgroundColor = "#607d8b";
    document.getElementById('notiBtn').style.backgroundColor = "#424242";

    if (document.getElementById('reqBtn') !== null) {
      document.getElementById('reqBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('raBtn') !== null) {
      document.getElementById('raBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('hdBtn') !== null) {
      document.getElementById('hdBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('postBtn') !== null) {
      document.getElementById('postBtn').style.backgroundColor = "#424242";
    }
    document.getElementById('dash').innerText = "Private Messages";

    this.showEdit = false;
    this.showPM = true;
    this.showRA = false;
    this.showHD = false;
    this.showReqChan = false;
    this.showPostPriv = false;
    this.showNotify = false;
  }

  //only residents
  showRequestChannel() {
    document.getElementById('editProfileBtn').style.backgroundColor = "#424242";
    document.getElementById('pmBtn').style.backgroundColor = "#424242";
    document.getElementById('notiBtn').style.backgroundColor = "#424242";

    if (document.getElementById('reqBtn') !== null) {
      document.getElementById('reqBtn').style.backgroundColor = "#607d8b";
    }
    if (document.getElementById('raBtn') !== null) {
      document.getElementById('raBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('hdBtn') !== null) {
      document.getElementById('hdBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('postBtn') !== null) {
      document.getElementById('postBtn').style.backgroundColor = "#424242";
    }
    document.getElementById('dash').innerText = "Request Channel";

    this.showEdit = false;
    this.showPM = false;
    this.showRA = false;
    this.showHD = false;
    this.showReqChan = true;
    this.showPostPriv = false;
    this.showNotify = false;
  }

  //hd or ra
  showRaAdmin() {
    document.getElementById('editProfileBtn').style.backgroundColor = "#424242";
    document.getElementById('pmBtn').style.backgroundColor = "#424242";
    document.getElementById('notiBtn').style.backgroundColor = "#424242";

    if (document.getElementById('reqBtn') !== null) {
      document.getElementById('reqBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('raBtn') !== null) {
      document.getElementById('raBtn').style.backgroundColor = "#607d8b";
    }
    if (document.getElementById('hdBtn') !== null) {
      document.getElementById('hdBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('postBtn') !== null) {
      document.getElementById('postBtn').style.backgroundColor = "#424242";
    }
    document.getElementById('dash').innerText = "RA Admin";
    this.showEdit = false;
    this.showPM = false;
    this.showRA = true;
    this.showHD = false;
    this.showReqChan = false;
    this.showPostPriv = false;
    this.showNotify = false;
  }

  //hd
  showHdAdmin() {
    document.getElementById('editProfileBtn').style.backgroundColor = "#424242";
    document.getElementById('pmBtn').style.backgroundColor = "#424242";
    document.getElementById('notiBtn').style.backgroundColor = "#424242";

    if (document.getElementById('reqBtn') !== null) {
      document.getElementById('reqBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('raBtn') !== null) {
      document.getElementById('raBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('hdBtn') !== null) {
      document.getElementById('hdBtn').style.backgroundColor = "#607d8b";
    }
    if (document.getElementById('postBtn') !== null) {
      document.getElementById('postBtn').style.backgroundColor = "#424242";
    }
    document.getElementById('dash').innerText = "HD Admin";
    this.showEdit = false;
    this.showPM = false;
    this.showRA = false;
    this.showHD = true;
    this.showReqChan = false;
    this.showPostPriv = false;
    this.showNotify = false;
  }

  //hd or ra
  showPostingPrivileges() {
    document.getElementById('editProfileBtn').style.backgroundColor = "#424242";
    document.getElementById('pmBtn').style.backgroundColor = "#424242";
    document.getElementById('notiBtn').style.backgroundColor = "#424242";

    if (document.getElementById('reqBtn') !== null) {
      document.getElementById('reqBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('raBtn') !== null) {
      document.getElementById('raBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('hdBtn') !== null) {
      document.getElementById('hdBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('postBtn') !== null) {
      document.getElementById('postBtn').style.backgroundColor = "#607d8b";
    }
    document.getElementById('dash').innerText = "Posting Privileges";

    this.showEdit = false;
    this.showPM = false;
    this.showRA = false;
    this.showHD = false;
    this.showReqChan = false;
    this.showPostPriv = true;
    this.showNotify = false;

  }

  showNotifications() {
    document.getElementById('editProfileBtn').style.backgroundColor = "#424242";
    document.getElementById('pmBtn').style.backgroundColor = "#424242";
    document.getElementById('notiBtn').style.backgroundColor = "#607d8b";

    if (document.getElementById('reqBtn') !== null) {
      document.getElementById('reqBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('raBtn') !== null) {
      document.getElementById('raBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('hdBtn') !== null) {
      document.getElementById('hdBtn').style.backgroundColor = "#424242";
    }
    if (document.getElementById('postBtn') !== null) {
      document.getElementById('postBtn').style.backgroundColor = "#424242";
    }
    document.getElementById('dash').innerText = "Notifications";


    this.showEdit = false;
    this.showPM = false;
    this.showRA = false;
    this.showHD = false;
    this.showReqChan = false;
    this.showPostPriv = false;
    this.showNotify = true;
  }

}
