import { Component, OnInit, Inject, Optional, OnDestroy } from '@angular/core';
import { RezziService } from '../rezzi.service';
import { Router } from '@angular/router';
import { Profile } from '../classes.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PMSidePanelService } from '../dashboard/pm-interface/pm-side-panel/pm-side-panel.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  session: any;
  currentUserRezzi: any;
  profile: Profile;
  userFound: boolean;
  sameRezzi: boolean;
  prof: Profile;
  profToGet: string;
  public non_pm_users2 = [];

  constructor(private privateSidePanelService: PMSidePanelService,
              private rezziService: RezziService,
              private router: Router,
              private http: HttpClient,
              @Optional() public dialog: MatDialogRef<ProfileComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data?: any) {
                console.log('data', this.data);
              }

  ngOnInit() {
    this.rezziService.getSession().then((response) => {

      if (response.email == null) {             /* User must be signed in to view other profiles */
        this.router.navigate(['/sign-in']);
      } else if (response.verified === false) { /* signed in but not verified */
        this.router.navigate(['/sign-up']);
      }

      this.currentUserRezzi = response.rezzi;   /* used to compare user and profile's Rezzis */

// TODO check if verified

      this.rezziService.getSession().then(session => {
        this.session = session;
      });

      if (this.data === null) {
        const query = window.location.search;
        const urlParam = new URLSearchParams(query);
        this.profToGet = urlParam.get('u');
      } else {
        this.profToGet = this.data.p;
      }

      this.rezziService.getProfile(this.profToGet).then(data => {
        if (data) {
          this.userFound = true;
          if (data.user.image_url == null) {
            this.prof = new Profile (
              data.user.email,
              data.user.firstName,
              data.user.lastName,
              data.user.rezzi,
              data.user.floor,
              data.user.major,
              data.user.nickName,
              data.user.bio,
              '../../../assets/images/default_profile.jpg',
            );
          } else {
            this.prof = new Profile (
              data.user.email,
              data.user.firstName,
              data.user.lastName,
              data.user.rezzi,
              data.user.floor,
              data.user.major,
              data.user.nickName,
              data.user.bio,
              data.user.image_url,
            );
          }
        } else {
          this.userFound = false;
        }
      }).then(prof => {
        if (this.currentUserRezzi !== this.prof.rezzi) {
          this.sameRezzi = false;
        } else {
          this.sameRezzi = true;
          this.profile = this.prof;
        }
      });
    });
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  navigatePMs(user: string) {
    if(this.dialog){
      this.dialog.close();
    }
    this.privateSidePanelService.getNonPrivateMessageUsers().subscribe(data => {
      // tslint:disable-next-line: forin
      for (const index in data) {
        this.non_pm_users2.push(data[index])
      }
      console.log(this.non_pm_users2);
      if(this.non_pm_users2.indexOf(user) > -1){
        this.non_pm_users2.splice(this.non_pm_users2.indexOf(user),1);
        console.log("USER DOES NOT HAVE A PM ALREADY");
        let body = {
          to: user,
          from: this.session.email
        }
        this.http.post<{ notification: string }>('/create-pm', body).subscribe(responseData =>
          {
          });
        this.router.navigate(['/dashboard'], {queryParams: {nav: 'pm', user}});


      }
      else{
        console.log("USER HAS A PM ALREADY");
        // User already has a private message created;
        this.router.navigate(['/dashboard'], {queryParams: {nav: 'pm', user}});
      }
      //console.log(this.non_pm_users);
    })
    // check if
    // check if user has pm already .getNonPrivateMessageUsers()
    // createPM()

  }


}
