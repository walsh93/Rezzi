import { Component, OnInit } from "@angular/core";
import { User, HDUser } from "src/app/classes.model";
import { RezziService } from "../../../rezzi.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { firestore } from "firebase";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-edit-profile-form",
  templateUrl: "./edit-profile-form.component.html",
  styleUrls: ["./edit-profile-form.component.css"]
})
export class EditProfileFormComponent implements OnInit {
  theUser: User;
  hide = true;
  hd: string;
  theHD: HDUser;

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
      //password: form.value.password,
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
    //this.theUser.password = userInfo.password;

    this.editUser(userInfo);
  }

  onEditPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    let pw = {
      password: form.value.password
    };
    this.theUser.password = pw.password;
    this.editUser(pw);
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
    alert("Your profile has been edited!");
  }
  ondeletionRequest() {
    this.checkUser();
  }

  checkUser() {
    this.rezziService.getSession().then(session => {
      if (session.accountType === 0) {
        // not a resident
        alert("Only non-hall director accounts can request deletion!");
      } else {
        this.theUser.deletionRequest = 1;
        this.deletionRequest(this.theUser);
        this.updateHallDirector(this.hd, this.theUser.email);
      }
    });
  }
  deletionRequest(data) {
    this.http
      .post<{ notification: string }>(
        "http://localhost:4100/dashboard/api/edit-profile/deletion",
        data
      )
      .subscribe(responseData => {
        console.log(responseData.notification);
      });
  }
  updateHallDirector(hd, user) {
    // console.log("updatehd"+ hd);
    this.rezziService.findUserByEmail(hd, user).then(response => {
      this.theHD = new HDUser(
        response.hd.firstName,
        response.hd.lastName,
        response.hd.email,
        response.hd.password,
        response.hd.verified,
        response.hd.deletionRequests
      );
      if (this.theHD.deletionRequests === undefined) {
        this.theHD.deletionRequests = [];
      }
      if (this.theHD.deletionRequests.includes(this.theUser.email)) {
      } else {
        this.theHD.deletionRequests.push(this.theUser.email);
        // console.log(this.theHD.deletionRequests[0]);
      }
    });

    this.updateHD(hd, user);
  }

  updateHD(hd, user) {
    this.http
      .post<{ notification: string }>(
        `http://localhost:4100/dashboard/api/edit-profile/update-hd?hd=${hd}&user=${user}`,
        hd
      )
      .subscribe(responseData => {
        console.log(responseData.notification);
      });
    alert("You have requested to delete your account!");
  }

  loadProfilePicture(user) {
    if (document.readyState !== "loading") {
      console.log("document is already ready, just execute code here");

      // this.theUser.setImageUrl(this.theUser.image_url);
      document.createElement("img").setAttribute("src",user.image_url);
      //document.getElementById("profile").setAttribute("src", user.image_url);
    } else {
      document.addEventListener("DOMContentLoaded", function() {
        console.log("document was not ready, place code here");

        // this.theUser.setImageUrl(this.theUser.image_url);
        document.getElementById("profile").setAttribute("src", user.image_url);
      });
    }
    //  if (this.theUser.image_url) {

    console.log("URL: " + user.image_url);
    // }
  }

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
          true,
          response.user.deletionRequest,
          response.user.image_url
        );
        // Show image section

        // else {
        //   document.getElementById("profile-photo").setAttribute("hidden", "true");
        //   document.getElementById("no-profile-photo").removeAttribute("hidden");
        // }
        this.loadProfilePicture(this.theUser);

      });


      this.rezziService.getHDEmail().then(response => {
        this.hd = response.hd;
        // console.log("hall director:" + response.hd);
        if ((this.theUser.deletionRequest = 1)) {
          // console.log("it is 1!!");
        }
      });
    });
  }
}
