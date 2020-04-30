import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-rezzi',
  templateUrl: './create-rezzi.component.html',
  styleUrls: ['./create-rezzi.component.css']
})
export class CreateRezziComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  floors = [
    {
      id: 0,
      name: 'Example Floor Name',
      channels: [
        {
          id: 0,
          name: 'General',
          // default: true
        },
      ]
    },
  ];

  ra_channels = [
    {
      id: 0,
      name: 'General',
      // default: true
    },
  ];

  hallwide_channels = [
    {
      id: 0,
      name: 'General',
      // default: true
    },
  ];
  private floor_empty_ids: number[];
  private ra_empty_ids: number[];
  private hallwide_empty_ids: number[];

  constructor(private http: HttpClient, private _formBuilder: FormBuilder, private router: Router, private _snackBar: MatSnackBar) {
    this.floor_empty_ids = [];
    this.ra_empty_ids = [];
    this.hallwide_empty_ids = [];
  }

  displayMessage(message: string) {
    this._snackBar.open(message, 'Dismiss', {
      duration: 4000,
    });
  }

  detectSameName(objects: any) {
    let to_return = false;
    objects.forEach(object => {
      if (objects.filter(obj => obj.name === object.name ).length > 1) {
        to_return = true;
      }
    });
    return to_return;
  }

  createRezzi() {
    // Validate data
    if (this.detectSameName(this.floors)) {
      this.displayMessage('Floors must have unique names');
      return;
    }
    this.floors.forEach(floor => {
      if (this.detectSameName(floor.channels)) {
        this.displayMessage('Channels must have unique names within floors (Check ' + floor.name + ')');
        return;
      }
    })
    if (this.detectSameName(this.hallwide_channels)) {
      this.displayMessage('Channels must have unique names (Check Hallwide Channels)');
      return;
    }
    if (this.detectSameName(this.ra_channels)) {
      this.displayMessage('Channels must have unique names (Check RA Channels)');
      return;
    }

    const rezzi_name = (document.getElementById('rezzi-name') as HTMLInputElement).value;
    let body = {
      name: rezzi_name,
      floors: this.floors,
      ra_channels: this.ra_channels,
      hallwide_channels: this.hallwide_channels
    };

    this.http.post('/create-rezzi', body).toPromise().then((response) => {
      console.log(response);
      this.displayMessage('Rezzi Created!')
      this.router.navigate(['/dashboard']);
    }).catch((error) => {
      console.log(error);
    });
  }

  addFloor() {
    let temp_id = this.floors.length;
    if (this.floor_empty_ids.length > 0) {
      temp_id = this.floor_empty_ids.pop();
    }
    this.floors.push({
      id: temp_id,
      name: 'Example Floor Name',
      channels: [
        {
          id: 0,
          name: 'General',
          // default: true
        },
      ]
    })
  }

  deleteFloor(floor_id: number) {
    let index = this.floors.findIndex((floor) => {
      return floor.id === floor_id;
    });
    this.floors.splice(index, 1);
    this.floor_empty_ids.push(floor_id);
  }

  addChannel(type: string) {
    let to_add = {
      id: -1,
      name: 'Example Channel Name',
      default: true
    }
    if (type === 'hallwide') {
      let temp_id = this.hallwide_channels.length;
      if (this.hallwide_empty_ids.length > 0) {
        temp_id = this.hallwide_empty_ids.pop();
      }
      to_add.id = temp_id;
      this.hallwide_channels.push(to_add);
    }
    else if (type === 'ra') {
      let temp_id = this.ra_channels.length;
      if (this.ra_empty_ids.length > 0) {
        temp_id = this.ra_empty_ids.pop();
      }
      to_add.id = temp_id;
      this.ra_channels.push(to_add);
    }
  }

  deleteChannel(type: string, channel_id: number) {
    if (type === 'hallwide') {
      let index = this.hallwide_channels.findIndex((channel) => {
        return channel.id === channel_id;
      });
      this.hallwide_channels.splice(index, 1);
      this.hallwide_empty_ids.push(channel_id);
    }
    else if (type === 'ra') {
      let index = this.ra_channels.findIndex((channel) => {
        return channel.id === channel_id;
      });
      this.ra_channels.splice(index, 1);
      this.ra_empty_ids.push(channel_id);
    }
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

}
