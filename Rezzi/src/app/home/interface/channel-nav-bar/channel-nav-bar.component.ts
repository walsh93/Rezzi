import { Component, OnInit, HostBinding } from '@angular/core';
import { ChannelNavBarService } from './channel-nav-bar.service';
@Component({
  selector: 'app-channel-nav-bar',
  templateUrl: './channel-nav-bar.component.html',
  styleUrls: ['./channel-nav-bar.component.css']
})

export class ChannelNavBarComponent implements OnInit {
  @HostBinding('class.nav-title')
  navTitle = 'Rezzi';
  channelMenuDisabled = true;

  constructor(private channelNavBarService: ChannelNavBarService) {}

  ngOnInit() {
    this.channelNavBarService.setTitle.subscribe(navTitle => {
      this.navTitle = navTitle;
      if (this.navTitle !== 'Rezzi') {
        this.channelMenuDisabled = false;
      }
    });
  }

  leaveChannel() {
    if (this.navTitle === 'Rezzi') {
      console.error('No channel selected');
      return;
    }
    console.log('user wants to leave ' + this.navTitle);
    // TODO implement leave-channel route, and "are you sure?" dialog box
  }
}
