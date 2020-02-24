import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-floor-drawer',
  templateUrl: './floor-drawer.component.html',
  styleUrls: ['./floor-drawer.component.css']
})
export class FloorDrawerComponent implements OnInit {
  @Input() public name: string;
  @Input() public channels: { name: string, default: boolean }[];

  constructor() { }

  ngOnInit() {
  }

}
