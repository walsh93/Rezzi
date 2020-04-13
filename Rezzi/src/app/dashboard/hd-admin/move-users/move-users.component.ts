import { Component, OnInit } from '@angular/core';
import { RezziService } from 'src/app/rezzi.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ResidentPrivilegeInfo } from 'src/app/classes.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-move-users',
  templateUrl: './move-users.component.html',
  styleUrls: ['./move-users.component.css']
})
export class MoveUsersComponent implements OnInit {

  private MOVE_TO = 'Move to...';
  title = 'Fetching residents...';
  message = 'Move residents between floors within your Rezzi';

  // Variables that must be updated for table data as residents are moved
  private usersByFloorMap = new Map<string, Map<string, ResidentPrivilegeInfo>>();
  private userToFloorMap = new Map<string, string>();

  // Other table data info
  floors: string[] = [];
  floorSelectionForUser = new Map<string, string>();
  matTableDataMap = new Map<string, MatTableDataSource<ResidentPrivilegeInfo>>();  // floor --> array of users on floor
  columnsToDisplay: string[] = ['fnameCol', 'lnameCol', 'emailCol', 'actTypeCol', 'floorMenuCol', 'buttonCol'];

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
          if (res.floors != null && res.floors !== undefined) {
            this.floors = res.floors as string[];
          }

          // Initializes the usersByFloorMap: floor --> Map<email, user data>
          infoList.forEach(user => {
            const floor = user.floor;
            if (!this.usersByFloorMap.has(floor)) {  // Initialize the map if it isn't there yet
              this.usersByFloorMap.set(floor, new Map<string, ResidentPrivilegeInfo>());
            }
            const mapOfUsersOnThisFloor = this.usersByFloorMap.get(floor);
            mapOfUsersOnThisFloor.set(user.email, user);
            this.usersByFloorMap.set(floor, mapOfUsersOnThisFloor);  // Add user to map of users for this floor
            this.userToFloorMap.set(user.email, floor);  // Make a mapping for the user to their respective floor
            this.floorSelectionForUser.set(user.email, this.MOVE_TO);
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

  selectFloorForUser(email: string, floor: string) {
    this.floorSelectionForUser.set(email, floor);
  }

  moveUser(email: string) {
    const floor = this.floorSelectionForUser.get(email);
    if (floor == null || floor === undefined || floor === this.MOVE_TO) {
      console.log('No floor selected');
      return;
    }
    if (this.usersByFloorMap.get(floor).has(email)) {
      console.log('The user is already on this floor.');
      this.floorSelectionForUser.set(email, this.MOVE_TO);  // Reset floor selection
      return;
    }

    const body = { email, newFloor: floor };
    this.http.post('/move-user', body).toPromise().then(response => {
      if ((response as any).status >= 200 && (response as any).status < 300) {
        this.updateMapsAfterMove(email, floor);
      } else {
        console.log('update unsuccessful');  // TODO change to mat-dialog
        console.log(response);
      }
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status >= 200 && res.status < 300) {
        console.log(res);
        this.updateMapsAfterMove(email, floor);
      } else {
        console.log('error');
      }
    });
  }

  updateMapsAfterMove(email: string, newFloor: string) {
    // Get (old) user data
    const oldFloor = this.userToFloorMap.get(email);
    const userData = this.usersByFloorMap.get(oldFloor).get(email);

    // Remove the user from the floor they were on
    this.userToFloorMap.set(email, newFloor);  // Update floor in user-->floor map
    const mapOfUsersOnOldFloor = this.usersByFloorMap.get(oldFloor);
    if (!mapOfUsersOnOldFloor.delete(email)) {
      console.log(`${email} could not be found on ${oldFloor}`);
    }
    this.usersByFloorMap.set(oldFloor, mapOfUsersOnOldFloor);

    // Add the user to the floor they have been moved to
    const mapOfUsersOnNewFloor = this.usersByFloorMap.get(newFloor);
    mapOfUsersOnNewFloor.set(email, userData);
    this.usersByFloorMap.set(newFloor, mapOfUsersOnNewFloor);

    // Reset floor selection
    this.floorSelectionForUser.set(email, this.MOVE_TO);

    // Update table data for old floor
    const arrayOfUsersOnOldFloor = Array.from(mapOfUsersOnOldFloor.values());
    const matTableDataForOldFloor = new MatTableDataSource(arrayOfUsersOnOldFloor);
    this.matTableDataMap.set(oldFloor, matTableDataForOldFloor);

    // Update table data for new floor
    const arrayOfUsersOnNewFloor = Array.from(mapOfUsersOnNewFloor.values());
    const matTableDataForNewFloor = new MatTableDataSource(arrayOfUsersOnNewFloor);
    this.matTableDataMap.set(newFloor, matTableDataForNewFloor);
  }

}
