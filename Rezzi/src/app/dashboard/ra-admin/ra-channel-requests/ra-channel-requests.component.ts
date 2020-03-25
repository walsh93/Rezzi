import { Component, OnInit, Input } from '@angular/core';
import { RezziService } from '../../../rezzi.service';

@Component({
  selector: 'app-ra-channel-requests',
  templateUrl: './ra-channel-requests.component.html',
  styleUrls: ['./ra-channel-requests.component.css']
})
export class RaChannelRequestsComponent implements OnInit {

  channelRequestIds: Array<string>;
  channelRequestNames: Map<string, number>;
  channelRequestDetails: Map<string, any>;

  // Data from parent element
  @Input() email: string;

  constructor(private rezziService: RezziService) { }

  ngOnInit() {
    this.channelRequestNames = new Map<string, number>();
    this.channelRequestDetails = new Map<string, any>();

    // Use this for testing
    this.createMockData();
    this.extractChannelNames();

    // Use this for real life
    // this.rezziService.getChannelRequests().then((reqIds) => {
    //   this.channelRequestIds = reqIds;
    // });
  }

  extractChannelNames() {
    for (let i = 0; i < this.channelRequestIds.length; i++) {
      const channelID = this.channelRequestIds[i];
      const firstDash = channelID.indexOf('-');
      const prefix = channelID.substring(0, firstDash);
      if (prefix === 'floors') {
        const secondDash = channelID.indexOf('-', firstDash + 1);
        const title = channelID.substring(secondDash + 1);
        this.channelRequestNames.set(title, i);
      } else {
        const title = channelID.substring(firstDash + 1);
        this.channelRequestNames.set(title, i);
      }
    }
  }

  channelRequestSelected(event) {
    let index = -1;
    const dom = event.target as HTMLElement;
    if (dom.nodeName.toLowerCase() === 'span') {
      index = parseInt((dom.parentNode as HTMLButtonElement).value, 10);
    } else {
      index = parseInt(event.target.value, 10);
    }

    const channelID = this.channelRequestIds[index];
    if (!this.channelRequestDetails.has(channelID)) {
      console.log('Channel not yet retrieved...');
      this.channelRequestDetails.set(channelID, { mope: 'yay' });
    } else {
      console.log('Channel already in map!');
    }
  }

  createMockData() {
    this.channelRequestIds = [
      'floors-Basement-Basement channel request',
      'floors-Basement-Another basement channel request',
      'hallwide-Hall channel request',
      'hallwide-Another hall channel request',
    ];
  }

}
