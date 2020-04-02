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
  columnsToDisplay: string[] = ['email', 'fName', 'lName', 'floor', 'verified', 'admin', 'adminButton', 'lastEmailSent'];

  constructor(private rezziService: RezziService,
              private router: Router,
              private http: HttpClient) { }

  ngOnInit() {
    // Initialize class variables
    this.errorMsg = '';

    this.rezziService.getSession().then((session) => {
      this.session = session;
    });

    this.rezziService.getResidents().then((residentList) => {
      console.log('pulling the resident list');
      console.log(`Resident list is ${residentList[1]}`);
      this.residents = new MatTableDataSource(residentList.residentInfo);
    });

    this.rezziService.getRAs().then((RAList) => {
      console.log('pulling the RA list');
      console.log(`RA List IS ${RAList.RAInfo[1]}`);
      this.RAs = new MatTableDataSource(RAList.RAInfo);
    });
  }

  updateAccountType(email: string, accountType: number) {
    console.log('email ' + email + 'accountType ' + accountType);
    if (accountType === 1) {
      console.log('Changing accountType from 1 to 0');
      accountType = 0;
    } else if (accountType === 0) {
      console.log('Changing accountType from 0 to 1');
      accountType = 1;
    } else if (accountType === 2) {
      console.log('Cannot change admin rights of HD');
    }

    this.http.get<{notification: string}>(`/update-account-type?user=${email}&accountType=${accountType}`)
      .subscribe((data) => {
        console.log('User update data', data);
      });
  }

  resendEmail(email: string) {
    console.log('Resend email: ' + email);

    const body = {
      email: email,
      rezzi: this.session.rezzi
    };

    this.http.post('/resend-email', body).toPromise().then((response) => {
      location.reload();
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        alert(res.error.text);  // an alert is blocking, so the subsequent code will only run once alert closed
        location.reload();
      } else {
        alert(`There was an error while trying to resend an email to (${res.status}). Please try again later.`);
      }
    });
  }

}




