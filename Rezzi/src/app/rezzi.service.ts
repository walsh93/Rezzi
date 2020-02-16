import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RezziService {

  userUrl = "/get-user";

  constructor(private http: HttpClient) { }

  private getSessionUrl = '/get-session';

  getSession(): Promise<any> {
    return this.http.get(this.getSessionUrl).toPromise().then((response) => {
      return response;
    });  // No error codes in getSession.js, so no need for a catch statement
  }

  // getUser(userId): Promise<any> {
  //   return this.http.get(`${this.userUrl}/${userId}`).toPromise().then((response) => {
  //     return response;
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }

}
