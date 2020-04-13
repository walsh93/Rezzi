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
  showMoveUsers = false;

  constructor() { }

  ngOnInit(): void {
  }

  showCreateRezziComponent() {
    this.showInviteUsers = false;
    this.showhdNotifications = false;
    this.showCreateRezzi = true;
    this.showUserManagement = false;
    this.showMoveUsers = false;
  }

  showInviteUsersComponent() {
    this.showInviteUsers = true;
    this.showhdNotifications = false;
    this.showCreateRezzi = false;
    this.showUserManagement = false;
    this.showMoveUsers = false;
  }

  showNotificationsComponent() {
    this.showInviteUsers = false;
    this.showhdNotifications = true;
    this.showCreateRezzi = false;
    this.showUserManagement = false;
    this.showMoveUsers = false;
  }

  showUserManagementComponent() {
    this.showInviteUsers = false;
    this.showhdNotifications = false;
    this.showCreateRezzi = false;
    this.showUserManagement = true;
    this.showMoveUsers = false;
  }

  showMoveUsersComponent() {
    this.showInviteUsers = false;
    this.showhdNotifications = false;
    this.showCreateRezzi = false;
    this.showUserManagement = false;
    this.showMoveUsers = true;
  }

}
