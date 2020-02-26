import { Component, OnInit } from "@angular/core";
import { User } from "src/app/classes.model";
import { RezziService } from "../../../rezzi.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { firestore } from "firebase";
import { HttpClient } from "@angular/common/http";
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: "app-edit-profile-form",
  templateUrl: "./edit-profile-form.component.html",
  styleUrls: ["./edit-profile-form.component.css"]
})
export class EditProfileFormComponent implements OnInit {
  theUser: User;
  // constructor(private rezziService: RezziService, private router: Router) {}

  // ngOnInit() {
  //   this.rezziService.getSession().then(response => {
  //     if (response.email == null) {
  //       // not signed in
  //       this.router.navigate(["/sign-in"]);
  //     } else if (response.verified === false) {
  //       // signed in but not verified
  //       this.router.navigate(["/sign-up"]);
  //     } // else signed in and verified
  //     this.theUser = this.rezziService
  //       .getUserData(response.email)
  //       .then(response => {
  //         console.log('userdata: ' + this.theUser + " " + this.theUser.lastName )
  //       });
  //   });
  hide = true;

  // fetch user data
  // use "double b"
  onEditProfile(form: NgForm) {
    if (form.invalid) {
      return;
    }

    console.log(form);
    let userInfo = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      password: form.value.password,
      age: form.value.age,
      major: form.value.major,
      nickName: form.value.nickName,
      bio: form.value.bio
    };
    this.theUser.firstName = userInfo.firstName;
    this.theUser.lastName = userInfo.lastName;
    this.theUser.age = userInfo.age;
    this.theUser.major = userInfo.major;
    this.theUser.nickName = userInfo.nickName;
    this.theUser.bio = userInfo.bio;
    this.theUser.password = userInfo.password;

    this.editUser(userInfo);

  }

  constructor(
    private http: HttpClient,
    private rezziService: RezziService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    // let user: User;
  }

  editUser(data) {
    this.http
      .post<{ notification: string }>(
        "http://localhost:4100/dashboard/api/edit-profile",
        data
      )
      .subscribe(responseData => {
        console.log(responseData.notification);
      });

  }
  // getUser(data) {
  //   return this.http.get("/edit-profile");
  // }

  ngOnInit() {
    this.rezziService.getSession().then(response => {
      if (response.email == null) {
        // not signed in
        this.router.navigate(["/sign-in"]);
      } else if (response.verified === false) {
        // signed in but not verified
        this.router.navigate(["/sign-up"]);
      } // else signed in and verified
      this.rezziService.getUserProfile().then(response => {
        // this.theUser.setUser(
        this.theUser = new User(
          response.user.email,
          response.user.password,
          response.user.firstName,
          response.user.lastName,
          response.user.age,
          response.user.major,
          response.user.nickName,
          response.user.bio,
          true
        );


      });
    });
  }
}
