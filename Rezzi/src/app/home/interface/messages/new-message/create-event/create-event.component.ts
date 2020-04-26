import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessagesService } from '../../messages.service'; 
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  private start_date: Date;
  private end_date: Date;
  private start_time: string;
  private end_time: string;
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
      start_time: new Date(this.start_date.toDateString() + " " + this.start_time),
      end_time: new Date(this.end_date.toDateString() + " " + this.end_time),
      description: this.description
    });
  }
}
