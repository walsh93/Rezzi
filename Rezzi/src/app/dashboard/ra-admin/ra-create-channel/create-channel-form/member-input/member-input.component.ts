import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-member-input',
  templateUrl: './member-input.component.html',
  styleUrls: ['./member-input.component.css']
})
export class MemberInputComponent implements OnInit {

  @Output() triggerParent = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  callParentPlus() {
    this.triggerParent.next('triggered');
  }

}
