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

  constructor(private channelNavBarService: ChannelNavBarService) { }

  ngOnInit() {
    this.channelNavBarService.setTitle.subscribe(navTitle => {
      this.navTitle = navTitle;
    });
  }

}
