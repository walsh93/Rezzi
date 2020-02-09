import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'logout-button',  // This is the name of this component's HTML tag
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.css']
})
export class LogoutButtonComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  logout() {
    this.http.get('/logout').toPromise().then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log(error)
    })
  }

}
