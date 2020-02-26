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
  constructor(private rezziService: RezziService, private router: Router) { }

  ngOnInit() {
    this.rezziService.getSession().then((response) => {
      if (response.email == null) {  // not signed in
        this.router.navigate(['/sign-in']);
      } else if (response.verified === false) {  // signed in but not verified
        this.router.navigate(['/sign-up']);
      }  // else signed in and verified
    });
  }

}
