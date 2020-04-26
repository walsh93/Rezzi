import { Component, OnInit } from '@angular/core';
import { RezziService } from '../rezzi.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../classes.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  session: any;
  currentUserRezzi: any;
  profile: Profile;
  userFound: boolean;
  sameRezzi: boolean;
  prof: Profile;

  constructor(private rezziService: RezziService,
              private router: Router,
              private http: HttpClient) { }

  ngOnInit() {
    this.rezziService.getSession().then((response) => {

      if (response.email == null) {             /* User must be signed in to view other profiles */
        this.router.navigate(['/sign-in']);
      } else if (response.verified === false) { /* signed in but not verified */
        this.router.navigate(['/sign-up']);
      }

      this.currentUserRezzi = response.rezzi;   /* used to compare user and profile's Rezzis */

      this.rezziService.getSession().then(session => {
        this.session = session;
      });

      const query = window.location.search;
      const urlParam = new URLSearchParams(query);
      const profToGet = urlParam.get('u');

      this.rezziService.getProfile(profToGet).then(data => {
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
  }
}
