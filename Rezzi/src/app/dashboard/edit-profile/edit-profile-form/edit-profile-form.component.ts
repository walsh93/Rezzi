import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { User, HDUser } from "src/app/classes.model";
import { RezziService } from "../../../rezzi.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { firestore } from "firebase";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";

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
  selectedPicture: File = null;
  session: any;
  thePic: any;

  // @ViewChild('pic', true) pic: ElementRef;

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
    private _snackBar: MatSnackBar,
    private elementRef: ElementRef
  ) {}

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
    if(this.theUser.image_url){
      if (document.readyState !== "loading") {
        console.log("document is already ready");
        this.theUser.setImageUrl(this.theUser.image_url);
        this.thePic = this.theUser.image_url;
      } else {
        document.addEventListener("DOMContentLoaded", function() {
          console.log("document was not ready");
          this.theUser.setImageUrl(this.theUser.image_url);
          document.getElementById("profile").setAttribute("src", user.image_url);
        });
      }
    } else{
      this.thePic = '../../../../../src/assets/images/default_profile.jpg';
    }
  }
  onPictureSelected(event) {
    const file = event.target.files[0] as File;
    if (!file.type.startsWith("image")) {
      this.selectedPicture = null;
      alert("Please upload an image file");
    } else {
      this.selectedPicture = file;
    }
  }
  onUpload(value) {
    let fileToUpload: File = null;
    let progressId: string = null;

    // Set constants based on which file the user is uploading
    if (value === "image") {
      fileToUpload = this.selectedPicture;
      progressId = "pic_";
    } else {
      alert("Something went wrong while uploading; please try again later.");
      return;
    }

    if (fileToUpload === null) {
      alert("Please upload image file");
    } else {
      // document.getElementById(`${progressId}progress`).hidden = false;
      // document.getElementById(`${progressId}bar`).hidden = false;
      const formData = new FormData();
      formData.append(value, fileToUpload, fileToUpload.name);
      this.http
        .post(
          `https://us-central1-rezzi-33137.cloudfunctions.net/uploadFile?docId=${this.session.email}`,
          formData,
          { observe: "response" }
        )
        .subscribe(response => {
          if (response.status === 200) {
            // location.reload();
            alert(`Your photo has been uploaded...`);
          } else {
            alert(
              `Something went wrong. Return with a status code ${response.status}: ${response.statusText}`
            );
          }
        });
    }
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
      this.rezziService.getSession().then(session => {
        this.session = session;
      });
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
