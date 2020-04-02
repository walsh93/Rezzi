import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { RezziService } from '../rezzi.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userIsLoggedInSubsc: Subscription;
  userIsLoggedInObs: Observable<boolean>;
  userIsLoggedIn: boolean;

  constructor(private rezziService: RezziService) { }

  ngOnInit() {
    this.rezziService.getSession().then((session) => {
      if (session.email != null) {
        this.userIsLoggedIn = true;
      } else {
        this.userIsLoggedIn = false;
      }
    });

    this.userIsLoggedInObs = this.rezziService.getSignInStatusListener();
    this.userIsLoggedInSubsc = this.userIsLoggedInObs.subscribe((loggedInStatus) => {
      this.userIsLoggedIn = loggedInStatus;
    });
  }

  ngOnDestroy() {
    this.userIsLoggedInSubsc.unsubscribe();
  }

}
