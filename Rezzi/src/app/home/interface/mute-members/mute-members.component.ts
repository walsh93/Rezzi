import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-mute-members',
  templateUrl: './mute-members.component.html',
  styleUrls: ['./mute-members.component.css']
})
export class MuteMembersComponent implements OnInit, OnDestroy {

  isHidden = true;  // By default, want to show channel messages and new-message component
  private isHiddenSubsc: Subscription;
  @Input() isHiddenObs: Observable<boolean>;

  constructor() { }

  ngOnInit() {
    // Listen for whether or not to view this in the interface or some other component
    this.isHiddenSubsc = this.isHiddenObs.subscribe((viewNow) => {
      this.isHidden = !viewNow;
    });
  }

  ngOnDestroy() {
    this.isHiddenSubsc.unsubscribe();
  }

}
