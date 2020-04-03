import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hd-admin',
  templateUrl: './hd-admin.component.html',
  styleUrls: ['./hd-admin.component.css']
})
export class HdAdminComponent implements OnInit {
  showCreateRezzi = false;
  showInviteUsers = false;
  showUserManagement = false;
  showhdNotifications = false;
  constructor() { }

  ngOnInit(): void {
  }

}
