import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent implements OnInit {
/*  channels = [
    { name: 'First Floor Name', interests: ['a', 'b', 'c'] },
    { name: 'Second Floor Name', interests: ['d', 'e', 'f'] }
  ];
  */
  channels = [];

  constructor() { }

  ngOnInit() {
  }

}
