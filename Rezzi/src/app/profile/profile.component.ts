import { Component, OnInit, Inject, Optional } from '@angular/core';
import { RezziService } from '../rezzi.service';
import { Router } from '@angular/router';
import { Profile } from '../classes.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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

  constructor(private rezziService: RezziService,
              private router: Router,
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

  navigatePMs() {
    this.router.navigate(['/dashboard']);
    // TODO pass in user to pm
    // check if user has pm already .getNonPrivateMessageUsers()
    // createPM()

  }
}
