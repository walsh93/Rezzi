import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PMSidePanelService {
  constructor(private http: HttpClient) {}

  getPrivateMessageUsers() {
    return this.http.get('/get-pm-users');
  }
}
