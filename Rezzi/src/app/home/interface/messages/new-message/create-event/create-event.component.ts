import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessagesService } from '../../messages.service'; 
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  private date: Date;
  private time: string;
  private name: string;
  private description: string;
  @Output() public eventEmitter = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<CreateEventComponent>) { }

  ngOnInit() {
  }

  addEvent() {
    this.eventEmitter.emit({
      id: null,
      owner: null,
      name: this.name,
      time: this.time,
      date: this.date,
      description: this.description
    });
  }
}
