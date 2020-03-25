import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RezziService {
  constructor(private http: HttpClient) {}

  private getSessionUrl = '/get-session';

  private getUser = '/get-user';

  getSession(): Promise<any> {
    return this.http
      .get(this.getSessionUrl)
      .toPromise()
      .then(response => {
        return response;
      }); // No error codes in getSession.js, so no need for a catch statement
  }

  // getUserData(userId): Promise<any> {
  //   return this.http.get(`${this.getUser}/${userId}`).toPromise().then((response) => {
  //     return response;
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }
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

  getChannelRequests(): Promise<any> {
    return this.http.get('/get-channel-requests').toPromise().then((requests) => {
      return requests;
    }).catch((error) => {
      console.log(error);
    });
  }

}
