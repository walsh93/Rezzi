import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RezziService } from '../rezzi.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HDUser } from '../classes.model';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-sign-up-hd',
  templateUrl: './sign-up-hd.component.html',
  styleUrls: ['./sign-up-hd.component.css']
})
export class SignUpHdComponent implements OnInit {
  hide = true;

  constructor(private rezziService: RezziService, private router: Router, private http: HttpClient) { }

  onSignUpHD(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const newHDUser = new HDUser (
      form.value.firstName,
      form.value.lastName,
      form.value.email,
      form.value.password,
      true,
      [],
      [],
    );

    this.addUser(newHDUser);
               // check that email doesn't exist in database


  }

  addUser(user: HDUser) {
    this.http.post<{notification: string}>('http://localhost:4100/api/sign-up', user)
      .subscribe(responseData => {
        console.log(responseData.notification);
      });
  }


  /**
   * Get session data and determine whether or not you need to reroute
   * If the service is not called here, then if someone clicks a button to the Sign In page without
   * manually putting it in, the middleware function in permissions.js won't run
   */
  ngOnInit() {
    this.rezziService.getSession().then((response) => {
      if (response.email != null) {
        this.router.navigate(['/home']);
      }
    });
  }

}

