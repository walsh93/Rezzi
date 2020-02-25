import { Component, OnInit } from '@angular/core';
import { CreateRezziService } from './create-rezzi.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-rezzi',
  templateUrl: './create-rezzi.component.html',
  styleUrls: ['./create-rezzi.component.css']
})
export class CreateRezziComponent implements OnInit {
  floors = [
    {
      name: "Example Floor Name",
      channels: [
        {
          name: "General",
          default: true
        },
      ]
    },
  ];

  ra_channels = [
    {
      name: "General",
      default: true
    },
  ];

  hallwide_channels = [
    {
      name: "General",
      default: true
    },
  ];

  constructor(private http: HttpClient, private router: Router) { }

  createRezzi() {
    // const email = (document.getElementById('email') as HTMLInputElement).value;
    // const password = (document.getElementById('password') as HTMLInputElement).value;
    var body = {};
    console.log("floors: ", this.floors);
    console.log("ra_channels: ", this.ra_channels);
    console.log("hallwide_channels: ", this.hallwide_channels);
    // this.http.post('/create-rezzi', body).toPromise().then((response) => {

    // }).catch((error) => {

    // });
  }

  addFloor() {
    this.floors.push({
      name: "Example Floor Name",
      channels: [
        {
          name: "Example Channel Name",
          default: true
        },
      ]
    })
  }

  addChannel(type: string) {
    var to_add = {
      name: "Example Channel Name",
      default: true
    }
    if (type === 'hallwide') {
      this.hallwide_channels.push(to_add);
    }
    else if (type === 'ra') {
      this.ra_channels.push(to_add);
    }
  }

  ngOnInit(): void {
  }

}
