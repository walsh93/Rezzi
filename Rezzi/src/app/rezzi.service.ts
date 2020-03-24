import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class RezziService {
  constructor(private http: HttpClient) {}

  private getSessionUrl = "/get-session";

  private getUser = "/get-user";
  private getHD = "/get-hd";

  getSession(): Promise<any> {
    return this.http
      .get(this.getSessionUrl)
      .toPromise()
      .then(response => {
        return response;
      }); // No error codes in getSession.js, so no need for a catch statement
  }

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
  findUserByEmail(): Promise<any> {
    return this.http
      .get("/find-user")
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(error => {
        console.log(error);
      });
  }
  getHDEmail(): Promise<any> {
    return this.http
      .get("/get-hd")
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(error => {
        console.log(error);
      });
  }

  getFloors(): Promise<any> {
    return this.http
      .get("/get-floors")
      .toPromise()
      .then(floors => {
        return floors;
      })
      .catch(error => {
        console.log(error);
      });
  }
}
