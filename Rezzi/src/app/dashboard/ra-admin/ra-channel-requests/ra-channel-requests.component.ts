import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RezziService } from '../../../rezzi.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-ra-channel-requests',
  templateUrl: './ra-channel-requests.component.html',
  styleUrls: ['./ra-channel-requests.component.css']
})
export class RaChannelRequestsComponent implements OnInit, OnDestroy {

  channelRequestIds: Array<string>;
  channelRequestNames: Map<string, number>;
  channelRequestDetails: Map<string, any>;

  channelIsBeingViewed = false;
  channelData: any;

  // Asynchronous data handlers
  idSubscription: Subscription;
  nameSubscription: Subscription;
  nameObservable: Observable<Map<string, number>>;

  // Data from parent element
  @Input() email: string;
  @Input() rezzi: string;

  constructor(private rezziService: RezziService) { }

  ngOnInit() {
    this.channelRequestDetails = new Map<string, any>();

    // Use this for real life
    const listeners = this.rezziService.getChannelRequestListeners();
    this.idSubscription = listeners.chanReqIdSubj.subscribe((updatedIds) => {
      console.log('IDs are updating...');
      this.channelRequestIds = updatedIds;
      console.log(this.channelRequestIds);
    });
    this.nameObservable = listeners.chanReqNameSubj;
    this.nameSubscription = this.nameObservable.subscribe((updatedNames) => {
      console.log('Names are updating...');
      this.channelRequestNames = updatedNames;
      console.log(this.channelRequestNames);
    });
    this.rezziService.getChannelRequests();
  }

  ngOnDestroy() {
    this.idSubscription.unsubscribe();
    this.nameSubscription.unsubscribe();
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
      const paths = this.rezziService.createChannelPath(this.rezzi, channelID);
      if (paths == null) {
        alert('The channel request you are trying to view could not be retrieved');
        return;
      }

      // Get channel data assuming retrieval from DB succeeded
      this.rezziService.getChannelData(paths.channelPath, paths.channelName).then((data) => {
        if (data == null) {
          alert('The channel request you are trying to view could not be retrieved');
          return;
        }

        // Add data to mapping
        this.channelRequestDetails.set(channelID, data);
        this.channelData = data;
      });
    } else {
      this.channelData = this.channelRequestDetails.get(channelID);
    }

    this.channelIsBeingViewed = true;
  }

}
