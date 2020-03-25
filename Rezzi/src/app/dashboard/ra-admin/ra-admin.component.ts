import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ra-admin',
  templateUrl: './ra-admin.component.html',
  styleUrls: ['./ra-admin.component.css']
})
export class RaAdminComponent implements OnInit {

  showCreateChannel = false;
  showChannelRequests = false;

  // Data from parent element
  @Input() email: string;
  @Input() rezzi: string;

  constructor() { }

  ngOnInit(): void {
  }

}
