import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { ChannelData } from '../../../../classes.model';

// export interface ChannelData {
//   id: number,
//   channel: string,
//   users: number
// }

@Component({
  selector: 'app-join-channel',
  templateUrl: './join-channel.component.html',
  styleUrls: ['./join-channel.component.css']
})

export class JoinChannelComponent implements OnInit {
  dataSource: MatTableDataSource<ChannelData>;
  columnsToDisplay = ['channel', 'user-count', 'join-channel'];

  constructor(public dialogRef: MatDialogRef<JoinChannelComponent>, 
        @Inject(MAT_DIALOG_DATA) public data,
        private http: HttpClient) {
    let can_join: ChannelData[] = [];
    console.log(data);
    data.forEach(hall => {
      hall.subchannels.forEach(subchannel => {
        if (!subchannel.belongs) {  // if the user doesn't belong
          can_join.push(subchannel);
        }
      })
    });
    this.dataSource = new MatTableDataSource(can_join);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  joinChannel(id: string) {
    console.log("Would send a request to database to join channel " + id);
    this.http.post<{notification: string}>('/join-channel', {"channel_id": id})
    .subscribe(responseData => {
      console.log(responseData.notification);
    });
  }

  ngOnInit() {}
}