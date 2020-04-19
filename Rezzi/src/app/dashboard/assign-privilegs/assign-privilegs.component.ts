import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
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

  private RESET_FILTER = 'Reset filter';
  accountType: number;
  title = 'Fetching residents...';
  message = 'Modify user posting privileges across all channels';
  floors: string[] = [];
  private resPrivInfoMap = new Map<string, ResidentPrivilegeInfo>();
  residents: MatTableDataSource<ResidentPrivilegeInfo>;
  columnsToDisplay: string[] = ['fnameCol', 'lnameCol', 'emailCol', 'actTypeCol', 'buttonCol'];

  constructor(private rezziService: RezziService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.rezziService.getSession().then((session) => {
      if (session.email == null) {  // not signed in
        this.router.navigate(['/sign-in']);
      } else if (session.verified === false) {  // signed in but not verified
        this.router.navigate(['/sign-up']);
      } else if (session.accountType !== 1 && session.accountType !== 0) {  // not an RA or HD
        this.router.navigate(['/err/1/unauthorized']);
      } else {
        this.accountType = session.accountType;
        if (this.accountType === 0) {  // if hall director, get all users in Rezzi
          this.rezziService.getResidentsByFloor(null).then(res => {
            const infoList = res.infoList as ResidentPrivilegeInfo[];
            if (res.floors != null && res.floors !== undefined) {
              this.floors = [this.RESET_FILTER].concat(res.floors as string[]);
            }
            infoList.forEach(user => {
              this.resPrivInfoMap.set(user.email, user);
            });
            this.residents = new MatTableDataSource(Array.from(this.resPrivInfoMap.values()));
            this.title = 'Residents in your Rezzi';
          });
        } else if (this.accountType === 1) {
          this.rezziService.getUserProfile().then(profile => {
            this.rezziService.getResidentsByFloor(profile.user.floor).then(res => {
              const infoList = res.infoList as ResidentPrivilegeInfo[];
              infoList.forEach(user => {
                if (user.email !== session.email) {
                  this.resPrivInfoMap.set(user.email, user);
                }
              });
              this.residents = new MatTableDataSource(Array.from(this.resPrivInfoMap.values()));
              this.title = 'Residents on your floor';
            });
          });
        } else {
          this.title = 'That\'s strange...';
          this.message = 'You do not have permission to access this page.';
        }
      }
    });
  }

  setPrivileges(email: string, tf: string) {
    this.http.get(`/update-can-post?user=${email}&canPost=${tf}`).toPromise().then(response => {
      if ((response as any).status === 200) {
        const privInfo = this.resPrivInfoMap.get(email);
        privInfo.canPost = (tf === 'true');
        this.resPrivInfoMap.set(email, privInfo);
        this.residents = new MatTableDataSource(Array.from(this.resPrivInfoMap.values()));
      } else {
        console.log('update unsuccessful');  // TODO change to mat-dialog
      }
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        console.log(res);
      } else {
        console.log('error');
      }
    });
  }

  filterByFloor(floor: string) {
    if (floor === this.RESET_FILTER) {
      this.residents = new MatTableDataSource(Array.from(this.resPrivInfoMap.values()));
    } else {
      const filteredList: ResidentPrivilegeInfo[] = [];
      this.resPrivInfoMap.forEach((privInfo, email) => {
        if (privInfo.floor === floor) {
          filteredList.push(privInfo);
        }
      });
      this.residents = new MatTableDataSource(filteredList);
    }
  }

}
