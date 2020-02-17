import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.css']
})

export class InviteUsersComponent implements OnInit {

  // Class variables
  errorMsg: string;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    // Initialize class variables
    this.errorMsg = '';
  }

  initiateRAInvite(){

  }

  initiateResidentInvite(){
    
  }

}
