import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ra-admin',
  templateUrl: './ra-admin.component.html',
  styleUrls: ['./ra-admin.component.css']
})
export class RaAdminComponent implements OnInit {
  showCreateChannel = false;
  constructor() { }

  ngOnInit(): void {
  }

}
