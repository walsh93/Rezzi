import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-pm',
  templateUrl: './create-pm.component.html',
  styleUrls: ['./create-pm.component.css']
})
export class CreatePmComponent implements OnInit {
  users = [];

  @Output() public create_pm_event = new EventEmitter();

  constructor() { }



  ngOnInit() {
  }

}
