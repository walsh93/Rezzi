import { Component, OnInit } from '@angular/core';
import { RezziService } from '../rezzi.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../classes.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  session: any;
  currentUser: any;
  viewingUser: any;
  picture: any;
  viewingUserRezzi: any;


  constructor(private rezziService: RezziService,
              private router: Router,
              private http: HttpClient) { }

  ngOnInit() {
    this.rezziService.getSession().then((response) => {

      if (response.email == null) {
        this.router.navigate(['/sign-in']);   // User must be signed in to view other profiles
      } else if (response.verified === false) {
        // signed in but not verified
        this.router.navigate(['/sign-up']);
      } // else signed in and verified

      this.rezziService.getSession().then(session => {
        this.session = session;
      });

      // TODO ensure users can't view users outside of their own Rezzi

      this.rezziService.getProfile('aaronclynn13@gmail.com').then(data => {
        console.log(data);
        // this.theUser.setUser(
        this.viewingUser = new User (
          data.user.email,
          data.user.password,
          data.user.firstName,
          data.user.lastName,
          data.user.age,
          data.user.major,
          data.user.nickName,
          data.user.bio,
          data.user.verified,
          data.user.deletionRequest,
          data.user.image_url,
        );
        this.viewingUserRezzi = data.user.rezzi;
        this.loadProfilePicture();
      });
    });
  }

  loadProfilePicture() {
    if (this.viewingUser.image_url) {
      if (document.readyState !== 'loading') {
        // console.log('document is already ready');
        this.viewingUser.setImageUrl(this.viewingUser.image_url);
        this.picture = this.viewingUser.image_url;
      } else {
        document.addEventListener('DOMContentLoaded', function() {
          // console.log('document was not ready');
          this.viewingUser.setImageUrl(this.viewingUser.image_url);
          document.getElementById('profile').setAttribute('src', this.viewingUser.image_url);
        });
      }
    } else {
      this.picture = 'Rezzi/src/assets/images/default_profile.jpg';
    }
  }

}
