import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfile } from '../../classes.model';
import { Subscription } from 'rxjs';
import { InterfaceService } from './interface.service';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit, OnDestroy {

  // User profile data
  private userProfile: UserProfile;
  private userProfileSubsc: Subscription;

  constructor(private interfaceService: InterfaceService) { }

  ngOnInit() {
    this.userProfile = this.interfaceService.getUserProfile();
    if (this.userProfile != null && !this.userProfile.canPost) {  // Remove message bar is posting privileges have been revoked
      document.getElementById('newMessageBar').remove();
    }
    this.userProfileSubsc = this.interfaceService.getUserProfileListener().subscribe(user => {
      this.userProfile = user;
      if (!user.canPost) {  // Remove message bar is posting privileges have been revoked
        document.getElementById('newMessageBar').remove();
      }
    });
  }

  ngOnDestroy() {
    this.userProfileSubsc.unsubscribe();
  }

}
