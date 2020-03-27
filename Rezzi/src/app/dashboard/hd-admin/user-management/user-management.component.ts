import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../../rezzi.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  // Class variables
  errorMsg: string;
  session: any;
  RAs: Array<any>;
  residents: Array<any>;
  columnsToDisplay: string[] = ['email', 'fName', 'lName', 'floor', 'verified'];

  constructor(private rezziService: RezziService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
     // Initialize class variables
     this.errorMsg = '';

     this.rezziService.getSession().then((session) => {
      this.session = session;
    });

    this.rezziService.getRAs().then((RAList) => {
      console.log(`RA List IS ${RAList}`);
        this.RAs = RAList.email;
    });

    this.rezziService.getResidents().then((residentList) => {
      console.log(`Resident list is ${residentList}`);
      this.residents = residentList.email;
    });


  }

}




