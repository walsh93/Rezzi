import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface ChannelData {
  id: number,
  channel: string,
  users: number
}

@Component({
  selector: 'app-join-channel',
  templateUrl: './join-channel.component.html',
  styleUrls: ['./join-channel.component.css']
})

export class JoinChannelComponent implements OnInit {
  dataSource: MatTableDataSource<ChannelData>;
  columnsToDisplay = ['channel', 'user-count', 'join-channel'];

  constructor(public dialogRef: MatDialogRef<JoinChannelComponent>,
      @Inject(MAT_DIALOG_DATA) public data) {
    this.dataSource = new MatTableDataSource(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}
}