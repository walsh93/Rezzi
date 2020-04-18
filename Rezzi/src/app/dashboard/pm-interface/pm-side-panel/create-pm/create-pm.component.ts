import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { RezziService } from 'src/app/rezzi.service';

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
    private rezziService: RezziService,
    private http: HttpClient) {
    this.users = data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
  }

  createPrivateMessage(email: string) {
    this.rezziService.getSession().then((response) => {
      let body = {
        to: email,
        from: response.email
      }
      console.log("Creating chat with " + email);
      this.http.post<{ notification: string }>('/create-pm', body)
        .subscribe(responseData => {
          console.log(responseData);
        });
      var index = this.users.indexOf(email);
      if (index > -1) {
        this.users.splice(index, 1);
      }
      this.dialogRef.close();
      this.create_pm_event.emit(email);
    });
  }

}
