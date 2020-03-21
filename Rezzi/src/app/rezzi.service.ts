import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class RezziService {
  constructor(private http: HttpClient) {}

  private getSessionUrl = "/get-session";

  private getUser = "/get-user";

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
    return this.http
      .get("/get-user")
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(error => {
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

  getRAs(): Promise<any> {
    return this.http.get('/getRAs').toPromise().then((RAList) => {
      return RAList;
    }).catch((error) => {
      console.log(error);
    })
  }

  getResidents(): Promise<any> {
    return this.http.get('/getResidents').toPromise().then((residentList) => {
      return residentList;
    }).catch((error) => {
      console.log(error);
    })
  }

}
