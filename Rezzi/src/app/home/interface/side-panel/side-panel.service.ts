import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SidePanelService {
  constructor(private http: HttpClient) {}

  getChannels() {
    return this.http.get('/get-channels');
  }
}
