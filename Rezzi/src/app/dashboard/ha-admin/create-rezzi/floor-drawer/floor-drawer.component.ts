import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-floor-drawer',
  templateUrl: './floor-drawer.component.html',
  styleUrls: ['./floor-drawer.component.css']
})
export class FloorDrawerComponent implements OnInit {
  name: string;
  channels: { name: string, default: boolean }[];

  constructor() { }

  ngOnInit() {
  }

}
