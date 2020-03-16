import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PMSidePanelService {
  constructor(private http: HttpClient) {}

  getPrivateMessages() {
    return this.http.get('/get-pms');
  }
}
