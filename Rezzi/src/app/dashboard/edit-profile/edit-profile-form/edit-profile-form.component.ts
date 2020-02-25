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
    this.theUser.firstName = userInfo.firstName;
    this.theUser.lastName = userInfo.lastName;
    this.theUser.age = userInfo.age;
    this.theUser.major = userInfo.major;
    this.theUser.nickName = userInfo.nickName;
    this.theUser.bio = userInfo.bio;

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
    return this.http.get("/edit-profile");
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

      // this.theUser = this.rezziService
      //   .getUserData(response.email)
      //   .then(response => {
      //     console.log("userdata: " + this.theUser + " " + this.theUser.lastName);
      //   });
       this.rezziService.getUserProfile().then(response => {
         //response.user[0];

        // this.theUser.setUser(
          this.theUser = new User(response.user.email, response.user.password, response.user.firstName, response.user.lastName, response.user.age, response.user.major, response.user.nickName, response.user.bio, true );
          console.log("wrerw: " + response.user);
          console.log(" ewr: "+ response.user.password);
        //   this.theUser.password = response.user.password,
        //  this.theUser.firstName = response.user.firstName,
        //  this.theUser.lastName= response.user.lastName,
        //  this.theUser.age= response.user.age,
        //  this.theUser.major= response.user.major,
        //  this.theUser.nickName = response.user.nickName,
        //  this.theUser.bio = response.user.bio
        // );

        console.log("userdata: " + this.theUser.lastName + "k" + this.theUser.major);
      });
      // let user2= this.getUser(response.email);
      // console.log('USER thingy: '+ user2);
      // let userInfo = {
      //   firstName: user.firstName,
      //   lastName: form.value.lastName,
      //   age: form.value.age,
      //   major: form.value.major,
      //   nickName: form.value.nickName,
      //   bio: form.value.bio
      // };
    });
  }
}
