import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

}
