import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message } from './classes.model';

@Injectable({
  providedIn: 'root'
})
export class RezziService {

  constructor(private http: HttpClient) {}

  private getSessionUrl = '/get-session';
  private getUser = '/get-user';

  // Async data
  signInSubject = new Subject<boolean>();
  chanReqIdSubj = new Subject<string[]>();
  channelRequestNames = new Map<string, number>();
  chanReqNameSubj = new Subject<Map<string, number>>();

  reportedMessages: Array<Message>;


  /*********************************************************************************************************************************
   * Events and listeners
   ********************************************************************************************************************************/
  getSignInStatusListener() {
    return this.signInSubject.asObservable();
  }

  signingIn() {
    this.signInSubject.next(true);
  }

  signingOut() {
    this.signInSubject.next(false);
  }

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
    return this.http.get(this.getSessionUrl).toPromise().then(response => {
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

  getProfile(profile: string): Promise<any> {
    return this.http.get(`/get-profile?profile=${profile}`).toPromise().then(response => {
      return response;
    }).catch(error => {
      console.log(error);
    });
  }

  findUserByEmail(hd: string, user: string): Promise<any> {
    // console.log('Find user by email: ' + hd);
    return this.http.get(`/update-hd?hd=${hd}&user=${user}`).toPromise().then(response => {
      return response;
    }).catch(error => {
      console.log(error);
    });
  }

  getHDEmail(): Promise<any> {
    return this.http.get('/get-hd').toPromise().then(response => {
      return response;
    }).catch(error => {
      console.log(error);
    });
  }

  getFloors(): Promise<any> {
    return this.http.get('/get-floors').toPromise().then(floors => {
      return floors;
    }).catch(error => {
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

  getRAs(): Promise<any> {
    return this.http.get('/getRAs').toPromise().then((RAList) => {
      return RAList;
    }).catch((error) => {
      console.log(error);
    });
  }

  getResidents(): Promise<any> {
    return this.http.get('/getResidents').toPromise().then((residentList) => {
      return residentList;
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Get residents from the specified floor.
   * @param floor - the floor to fetch. If all floors (the entire Rezzi) is wanted, `floors` should be `null`.
   */
  getResidentsByFloor(floor: string): Promise<any> {
    let url: string = null;
    if (floor == null || floor === undefined) {
      url = '/get-residents-by-floor';
    } else {
      url = `/get-residents-by-floor/${floor}`;
    }
    return this.http.get(url).toPromise().then((response) => {
      return response;
    }).catch((error) => {
      console.log(error);
    });
  }

  getResidentsByChannel(channelID: string): Promise<any> {
    return this.http.get(`/get-residents-by-channel/${channelID}`).toPromise().then((response) => {
      return response;
    }).catch((error) => {
      console.log(error);
    });
  }
  getResidentsByChannelNonAdmin(channelID: string): Promise<any> {
    return this.http.get(`/get-residents-by-channel-non-admin/${channelID}`).toPromise().then((response) => {
      return response;
    }).catch((error) => {
      console.log(error);
    });
  }

  getDeletionRequests(): Promise<any> {
    return this.http.get('/getDeletionRequests').toPromise().then((deletionList) => {
      // console.log('Deletion List: ', deletionList);
      return deletionList;
   }).catch((error) => {
      console.log(error);
   });
  }

  getReportedMessages(): Promise<any> {
    return this.http.get('/get-reported-messages').toPromise().then((reportedList) => {
      // console.log('Reported List:', reportedList);
      return reportedList;
    }).catch((error) => {
      console.log(error);
    });
  }

  deleteReportedMessage(messageId: string, HDemail: string) {
    return this.http.get(`/delete-reported-message?messageId=${messageId}&HD=${HDemail}`).toPromise().then((message) => {
      return message;
    }).catch((error) => {
      console.log(error);
    });
  }

  getMessage(messageId: string): Promise<any> {
    return this.http.get(`/get-message?messageId=${messageId}`).toPromise().then((message) => {
      // console.log('Message data', message);
      return message;
    }).catch((error) => {
      console.log(error);
    });
  }

  getNotifications(): Promise<any> {
    return this.http.get('/getNotifications').toPromise().then((panelInfo) => {
      // console.log('Panel Info: ', panelInfo);
      return panelInfo;
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
