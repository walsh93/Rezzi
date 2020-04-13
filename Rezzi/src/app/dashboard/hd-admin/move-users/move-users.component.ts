import { Component, OnInit } from '@angular/core';
import { RezziService } from 'src/app/rezzi.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ResidentPrivilegeInfo } from 'src/app/classes.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-move-users',
  templateUrl: './move-users.component.html',
  styleUrls: ['./move-users.component.css']
})
export class MoveUsersComponent implements OnInit {

  title = 'Fetching residents...';
  message = 'Move residents between floors within your Rezzi';
  private usersByFloorMap = new Map<string, Map<string, ResidentPrivilegeInfo>>();
  matTableDataMap = new Map<string, MatTableDataSource<ResidentPrivilegeInfo>>();  // floor --> array of users on floor
  columnsToDisplay: string[] = ['fnameCol', 'lnameCol', 'emailCol', 'actTypeCol', /* 'moveMenu', */ 'buttonCol'];

  constructor(private rezziService: RezziService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.rezziService.getSession().then((session) => {
      if (session.email == null) {  // not signed in
        this.router.navigate(['/sign-in']);
      } else if (session.verified === false) {  // signed in but not verified
        this.router.navigate(['/sign-up']);
      } else if (session.accountType !== 0) {  // not an HD
        this.router.navigate(['/err/0/unauthorized']);
      } else {
        this.rezziService.getResidentsByFloor(null).then(res => {
          const infoList = res.infoList as ResidentPrivilegeInfo[];

          // Initializes the usersByFloorMap: floor --> Map<email, user data>
          infoList.forEach(user => {
            const floor = user.floor;
            if (!this.usersByFloorMap.has(floor)) {  // Initialize the map if it isn't there yet
              this.usersByFloorMap.set(floor, new Map<string, ResidentPrivilegeInfo>());
            }
            const mapOfUsersOnThisFloor = this.usersByFloorMap.get(floor);
            mapOfUsersOnThisFloor.set(user.email, user);
            this.usersByFloorMap.set(floor, mapOfUsersOnThisFloor);
          });

          // Initialize mat table data map
          this.usersByFloorMap.forEach((emailUserDataMap, floor) => {
            const arrayOfUsersOnThisFloor = Array.from(emailUserDataMap.values());
            const matTableDataForThisFloor = new MatTableDataSource(arrayOfUsersOnThisFloor);
            this.matTableDataMap.set(floor, matTableDataForThisFloor);
          });
          this.title = 'Residents in your Rezzi';
        });
      }
    });
  }

  moveUser(email: string) {
    console.log(`I want to move ${email}!!!`);
  }

}
