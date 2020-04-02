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
  RAs: MatTableDataSource<any>;
  residents: MatTableDataSource<any>;
  columnsToDisplay: string[] = ['email', 'fName', 'lName', 'floor', 'verified', 'lastEmailSent'];

  constructor(private rezziService: RezziService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
     // Initialize class variables
     this.errorMsg = '';

     this.rezziService.getSession().then((session) => {
      this.session = session;
    });

    this.rezziService.getResidents().then((residentList) => {
      console.log("pulling the resident list");
      console.log(`Resident list is ${residentList[1]}`);
      this.residents = new MatTableDataSource(residentList.residentInfo);
    });
    
    this.rezziService.getRAs().then((RAList) => {
      console.log("pulling the RA list");
      console.log(`RA List IS ${RAList.RAInfo[1]}`);
        this.RAs = new MatTableDataSource(RAList.RAInfo);
    });

    


  }

}




