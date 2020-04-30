import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RezziService } from '../../../rezzi.service';
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

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
  channelIndexBeingViewed = -1;
  channelIdBeingViewed: string;
  channelDataBeingViewed: any;

  // Asynchronous data handlers
  idSubscription: Subscription;
  nameSubscription: Subscription;
  nameObservable: Observable<Map<string, number>>;

  // Data from parent element
  @Input() email: string;
  @Input() rezzi: string;

  constructor(private rezziService: RezziService,
              private http: HttpClient,
              private router: Router,
              private snackBar: MatSnackBar) { }

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

  /**************************************************************************************************************************************
   * Channel selection functions
   *************************************************************************************************************************************/

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
        this.viewingFailure();
        return;
      }

      // Get channel data assuming retrieval from DB succeeded
      this.rezziService.getChannelData(paths.channelPath, paths.channelName, index).then((data) => {
        if (data == null) {
          this.viewingFailure();
          return;
        }

        // Add data to mapping
        this.channelRequestDetails.set(channelID, data);
        this.setChannelBeingViewed(index, channelID);
      });
    } else {
      this.setChannelBeingViewed(index, channelID);
    }
  }

  viewingFailure() {
    this.snackBar.open('The channel request you are trying to view could not be retrieved');
    this.rezziService.getChannelRequests();
  }

  setChannelBeingViewed(index: number, channelID: string) {
    this.channelIndexBeingViewed = index;
    this.channelIdBeingViewed = channelID;
    this.channelDataBeingViewed = this.channelRequestDetails.get(channelID);
    this.channelIsBeingViewed = true;
  }

  /**************************************************************************************************************************************
   * Channel response functions
   *************************************************************************************************************************************/

  approveRequest() {
    const approved = confirm('Are you sure you would like to approve this channel request?');
    if (approved) {
      console.log('Change tag, remove from array of requests, create-channel.js, and reload this page');
      this.respondToChannelRequest(true);
    }
  }

  denyRequest() {
    const p1 = 'Are you sure you would like to deny this channel request?';
    const p2 = 'If you confirm, this request will no longer appear on your dashboard.';
    const denied = confirm(`${p1} ${p2}`);
    if (denied) {
      console.log('Remove from array of requests in the database and reload this page');
      this.respondToChannelRequest(false);
    }
  }

  respondToChannelRequest(approved: boolean) {
    const paths = this.rezziService.createChannelPath(this.rezzi, this.channelIdBeingViewed);
    const body = {
      approved,
      channelPath: paths.channelPath,
      channelName: paths.channelName,
      channelID: this.channelIdBeingViewed,
      index: this.channelIndexBeingViewed,
    };

    this.http.post('/channel-requests', body).toPromise().then((response) => {
      this.rezziService.getChannelRequests();
      this.snackBar.open((response as any).msg);
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        this.rezziService.getChannelRequests();
        this.snackBar.open((res as any).msg);
      } else {
        console.log('Channel request response rejected');
        console.log((error as any).reject);
        this.snackBar.open((error as any).msg);
      }
    });
  }

}
