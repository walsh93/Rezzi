import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { RezziService } from 'src/app/rezzi.service';
import { ResidentPrivilegeInfo } from 'src/app/classes.model';

@Component({
  selector: 'app-assign-privilegs',
  templateUrl: './assign-privilegs.component.html',
  styleUrls: ['./assign-privilegs.component.css']
})
export class AssignPrivilegsComponent implements OnInit {

  private accountType: number;
  title: string;
  residents: MatTableDataSource<ResidentPrivilegeInfo>;
  columnsToDisplay: string[] = ['fnameCol', 'lnameCol', 'emailCol', 'actTypeCol', 'buttonCol'];

  constructor(private rezziService: RezziService, private router: Router) { }

  ngOnInit() {
    this.rezziService.getSession().then((response) => {
      if (response.email == null) {  // not signed in
        this.router.navigate(['/sign-in']);
      } else if (response.verified === false) {  // signed in but not verified
        this.router.navigate(['/sign-up']);
      } else if (response.accountType !== 1 && response.accountType !== 0) {  // not an RA or HD
        this.router.navigate(['/err/1/unauthorized']);
      } else {
        this.accountType = response.accountType;
        if (this.accountType === 0) {  // if hall director, get all users in Rezzi
          this.rezziService.getResidentsByFloor('all').then(list => {
            this.title = 'Residents in your Rezzi';
            this.residents = new MatTableDataSource(list);
          });
        }
      }
    });
  }

  revokePrivileges(email: string) {
    console.log(`revoke privileges for ${email}.`);
  }

}
