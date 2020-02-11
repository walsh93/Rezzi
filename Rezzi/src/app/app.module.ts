import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatSidenavModule,
 } from '@angular/material';

// Firebase Imports
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Angular stuff
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

// Sign-in / Sign-up Components
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpFormComponent } from './sign-up/sign-up-form/sign-up-form.component';
import { SignUpHdComponent } from './sign-up-hd/sign-up-hd.component';

import { SignInComponent } from './sign-in/sign-in.component';
import { SignInFormComponent } from './sign-in/sign-in-form/sign-in-form.component';
import { InfoBlockComponent } from './sign-in/info-block/info-block.component';



// Index Component (will likely change)
import { WelcomeComponent } from './welcome/welcome.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// Dashboard Components
import { DashboardComponent } from './dashboard/dashboard.component';

import { EditProfileComponent } from './dashboard/edit-profile/edit-profile.component';
import { EditProfileFormComponent } from './dashboard/edit-profile/edit-profile-form/edit-profile-form.component';

import { RaAdminComponent } from './dashboard/ra-admin/ra-admin.component';
import { RaCreateChannelComponent } from './dashboard/ra-admin/ra-create-channel/ra-create-channel.component';

import { CreateRezziComponent } from './dashboard/ha-admin/create-rezzi/create-rezzi.component';
import { InviteUsersComponent } from './dashboard/ha-admin/invite-users/invite-users.component';


// Home Page Components
import { HomeComponent } from './home/home.component';
import { InterfaceComponent } from './home/interface/interface.component';

import { SidePanelComponent } from './home/interface/side-panel/side-panel.component';
import { JoinChannelComponent } from './home/interface/side-panel/join-channel/join-channel.component';

import { ChannelMessagesComponent } from './home/interface/messages/channel-messages/channel-messages.component';
import { NewMessageComponent } from './home/interface/messages/new-message/new-message.component';

import { ChannelNavBarComponent } from './home/interface/channel-nav-bar/channel-nav-bar.component';


// Header Component
import { HeaderComponent } from './header/header.component';
import { SignOutButtonComponent } from './header/sign-out-button/sign-out-button.component';
import { MessagesService } from './home/interface/messages/messages.service';





@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignUpHdComponent,
    WelcomeComponent,
    SignInComponent,
    PageNotFoundComponent,
    EditProfileComponent,
    HeaderComponent,
    InterfaceComponent,
    SidePanelComponent,
    DashboardComponent,
    ChannelMessagesComponent,
    HomeComponent,
    NewMessageComponent,
    SignOutButtonComponent,
    SignInFormComponent,
    InfoBlockComponent,
    SignUpFormComponent,
    CreateRezziComponent,
    InviteUsersComponent,
    EditProfileFormComponent,
    SignInFormComponent,
    ChannelNavBarComponent,
    JoinChannelComponent,
    RaAdminComponent,
    RaCreateChannelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'rezzi'),
    AngularFireDatabaseModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSidenavModule
  ],
  providers: [MessagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }

