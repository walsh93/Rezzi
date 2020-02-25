import { Component, OnInit } from "@angular/core";
import { User } from "src/app/classes.model";
import { RezziService } from "../../../rezzi.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { firestore } from "firebase";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-edit-profile-form",
  templateUrl: "./edit-profile-form.component.html",
  styleUrls: ["./edit-profile-form.component.css"]
})
export class EditProfileFormComponent implements OnInit {

   user: User;
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
  //     this.user = this.rezziService
  //       .getUserData(response.email)
  //       .then(response => {
  //         console.log('userdata: ' + this.user + " " + this.user.lastName )
  //       });
  //   });
  hide = true;
  // fetch user data
  // use "double b"
  onEditProfile(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // if(form.value.age)
    // return;
    console.log(form);
    let userInfo = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      age: form.value.age,
      major: form.value.major,
      nickName: form.value.nickName,
      bio: form.value.bio
    };
    this.user.firstName = userInfo.firstName;
    this.user.lastName = userInfo.lastName;
    this.user.age = userInfo.age;
    this.user.major = userInfo.major;
    this.user.nickName = userInfo.nickName;
    this.user.bio = userInfo.bio;

    /* Katarina - This is all the form data:
      form.value.password,
      form.value.firstName,
      form.value.lastName,
      form.value.age,
      form.value.major,
      form.value.nickName,
      form.value.bio,
    */

    this.editUser(userInfo);
  }

  constructor(
    private http: HttpClient,
    private rezziService: RezziService,
    private router: Router
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
  getUser(data) {
        return this.http.get('/edit-profile');

  }
  // ngOnInit(): void {
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

      // this.user = this.rezziService
      //   .getUserData(response.email)
      //   .then(response => {
      //     console.log("userdata: " + this.user + " " + this.user.lastName);
      //   });
      let user2= this.getUser(response.email);
      console.log('USER thingy: '+ user2);
      // let userInfo = {
      //   firstName: user.firstName,
      //   lastName: form.value.lastName,
      //   age: form.value.age,
      //   major: form.value.major,
      //   nickName: form.value.nickName,
      //   bio: form.value.bio
      // };
      console.log("USER:" + this.user);
    });
  }
}
