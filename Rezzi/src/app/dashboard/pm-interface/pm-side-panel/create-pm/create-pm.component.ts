import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-pm',
  templateUrl: './create-pm.component.html',
  styleUrls: ['./create-pm.component.css']
})
export class CreatePmComponent implements OnInit {
  users = [];

  @Output() public create_pm_event = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<CreatePmComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private http: HttpClient) {
    this.users = data;
    console.log("here",data)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
  }

}
