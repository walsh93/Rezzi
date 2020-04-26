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

      this.currentUserRezzi = response.rezzi;
      console.log('currentUserRezzi', this.currentUserRezzi);

      this.rezziService.getSession().then(session => {
        this.session = session;
      });

      const query = window.location.search;
      const urlParam = new URLSearchParams(query);
      const profToGet = urlParam.get('u');

      // TODO ensure users can't view users outside of their own Rezzi
      // TODO add error handling if can't find user

      this.rezziService.getProfile(profToGet).then(data => {
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
            'Rezzi/src/assets/images/default_profile.jpg',
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
        console.log(this.prof);
      }).then(prof => {
        if (this.currentUserRezzi !== this.prof.rezzi) {
          this.sameRezzi = false;
          console.log('not in same rezzi');
          // throw error
        } else {
          this.sameRezzi = true;
          this.profile = this.prof;
        }
      });
    });
  }

  // loadProfilePicture() {
  //   if (this.profile.imageUrl) {
  //     if (document.readyState !== 'loading') {
  //       // console.log('document is already ready');
  //       // this.profile.setImageUrl(this.profile.imageUrl);
  //       this.picture = this.profile.imageUrl;
  //     } else {
  //       document.addEventListener('DOMContentLoaded', function() {
  //         // console.log('document was not ready');
  //         this.picture = 'Rezzi/src/assets/images/default_profile.jpg';
  //         // this.viewingUser.setImageUrl(this.viewingUser.image_url);
  //         // document.getElementById('profile').setAttribute('src', this.viewingUser.image_url);
  //       });
  //     }
  //   } else {

  //     this.picture = 'Rezzi/src/assets/images/default_profile.jpg';
  //   }
  // }

}
