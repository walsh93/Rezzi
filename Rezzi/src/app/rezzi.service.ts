import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RezziService {

  private getSessionUrl = '/get-session';
  private getUser = '/get-user';

  // Async data
  chanReqIdSubj = new Subject<string[]>();
  channelRequestNames = new Map<string, number>();
  chanReqNameSubj = new Subject<Map<string, number>>();

  constructor(private http: HttpClient) {}

  /*********************************************************************************************************************************
   * Events and listeners
   ********************************************************************************************************************************/
  getChannelRequestListeners() {
    return {
      chanReqIdSubj: this.chanReqIdSubj.asObservable(),
      chanReqNameSubj: this.chanReqNameSubj.asObservable(),
    };
  }

  /*********************************************************************************************************************************
   * Backend calls
   ********************************************************************************************************************************/
  getSession(): Promise<any> {
    return this.http
      .get(this.getSessionUrl)
      .toPromise()
      .then(response => {
        return response;
      }); // No error codes in getSession.js, so no need for a catch statement
  }

  getUserProfile(): Promise<any> {
    return this.http.get('/get-user').toPromise().then(response => {
      return response;
    }).catch(error => {
      console.log(error);
    });
  }

  getFloors(): Promise<any> {
    return this.http.get('/get-floors').toPromise().then((floors) => {
      return floors;
    }).catch((error) => {
      console.log(error);
    });
  }

  getRaFromFloor(rezzi: string, floor: string): Promise<any> {
    return this.http.get(`/get-ra-from-floor?rezzi=${rezzi}&floor=${floor}`).toPromise().then((ra) => {
      return ra;
    }).catch((error) => {
      console.log(error);
    });
  }

  getChannelRequests() {
    this.http.get<{channelRequests: string[]}>('/get-channel-requests').subscribe((data) => {
      this.extractChannelNames(data.channelRequests);
      this.chanReqIdSubj.next(data.channelRequests);
      this.chanReqNameSubj.next(this.channelRequestNames);
    });
  }

  getChannelData(cp: string, cn: string, i: number): Promise<any> {
    return this.http.get(`/get-channel-data?channelPath=${cp}&channelName=${cn}&index=${i}`).toPromise().then((data) => {
      return data;
    }).catch((error) => {
      console.log(error);
    });
  }

  /*********************************************************************************************************************************
   * Helper functions
   ********************************************************************************************************************************/
  createChannelPath(rezzi: string, channelID: string) {
    if (channelID != null) {
      const resHallPath = `residence-halls/${rezzi}`;
      let channelPath = null;
      let channelName = null;
      const level = channelID.split('-')[0];
      if (level === 'floors') {
        // does NOT consider whether floor name has a '-', but DOES consider if channel name has a '-'
        const firstDash = channelID.indexOf('-');
        const secondDash = channelID.indexOf('-', firstDash + 1);
        const floorName = channelID.slice(firstDash + 1, secondDash);
        channelName = channelID.slice(secondDash + 1);
        channelPath = `${resHallPath}/floors/${floorName}/channels`;
      } else {  // either 'hallwide' or 'RA'
        const dash = channelID.indexOf('-');
        const hwOrRa = channelID.slice(0, dash);
        channelName = channelID.slice(dash + 1);
        channelPath = `${resHallPath}/${hwOrRa}`;
      }

      if (channelPath == null || channelName == null) {
        return null;
      }

      return { channelPath, channelName };
    }

    return null;
  }

  extractChannelNames(channelIds: string[]) {
    this.channelRequestNames.clear();  // If you don't clear, it will keep old requests that have already been handled
    for (let i = 0; i < channelIds.length; i++) {
      const channelID = channelIds[i];
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

}
