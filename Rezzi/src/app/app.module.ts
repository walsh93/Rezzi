import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatMenuModule,
  MatSelectModule,
  MatListModule,
  MatGridListModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTableModule,
  MatTabsModule,
  MatIconModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatBadgeModule,
  MatTooltipModule,
  MatDividerModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatRadioModule,
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
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// Dashboard Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditProfileComponent } from './dashboard/edit-profile/edit-profile.component';
import { EditProfileFormComponent } from './dashboard/edit-profile/edit-profile-form/edit-profile-form.component';

import { HdAdminComponent } from './dashboard/hd-admin/hd-admin.component';
import { CreateRezziComponent } from './dashboard/hd-admin/create-rezzi/create-rezzi.component';
import { ChannelPanelComponent } from './dashboard/hd-admin/create-rezzi/channel-panel/channel-panel.component';
import { FloorDrawerComponent } from './dashboard/hd-admin/create-rezzi/floor-drawer/floor-drawer.component';
import { InviteUsersComponent } from './dashboard/hd-admin/invite-users/invite-users.component';
import { UserManagementComponent } from './dashboard/hd-admin/user-management/user-management.component';
import { AssignPrivilegsComponent } from './dashboard/assign-privilegs/assign-privilegs.component';
import { MoveUsersComponent } from './dashboard/hd-admin/move-users/move-users.component';

import { RaAdminComponent } from './dashboard/ra-admin/ra-admin.component';
import { RaCreateChannelComponent } from './dashboard/ra-admin/ra-create-channel/ra-create-channel.component';
import { RaChannelRequestsComponent } from './dashboard/ra-admin/ra-channel-requests/ra-channel-requests.component';
import { RequestChannelComponent } from './dashboard/request-channel/request-channel.component';
import { RequestChannelFormComponent } from './dashboard/request-channel/request-channel-form/request-channel-form.component';

import { PmInterfaceComponent } from './dashboard/pm-interface/pm-interface.component';
import { PmSidePanelComponent } from './dashboard/pm-interface/pm-side-panel/pm-side-panel.component';
import { NewPmComponent } from './dashboard/pm-interface/private-messages/new-pm/new-pm.component';
import { PrivateMessagesComponent } from './dashboard/pm-interface/private-messages/private-messages/private-messages.component';


// Home Page Components
import { HomeComponent } from './home/home.component';
import { InterfaceComponent } from './home/interface/interface.component';

import { SidePanelComponent } from './home/interface/side-panel/side-panel.component';
import { JoinChannelComponent } from './home/interface/side-panel/join-channel/join-channel.component';

import { ChannelMessagesComponent } from './home/interface/messages/channel-messages/channel-messages.component';
import { NewMessageComponent } from './home/interface/messages/new-message/new-message.component';

import {
  ChannelNavBarComponent,
  LeaveChannelDialog,
  DeleteChannelDialog
} from './home/interface/channel-nav-bar/channel-nav-bar.component';
import { MessageComponent } from './home/interface/messages/message/message.component';
import { ImageModalComponent } from './home/interface/messages/new-message/image-modal/image-modal.component';

// Header Component
import { HeaderComponent } from './header/header.component';
import { SignOutButtonComponent } from './header/sign-out-button/sign-out-button.component';
import { MessagesService } from './home/interface/messages/messages.service';
import { ErrorComponent } from './error/error.component';
import { CreateChannelFormComponent } from './dashboard/ra-admin/ra-create-channel/create-channel-form/create-channel-form.component';

// Reset password components
import { PwordresetRequestComponent } from './pwordreset/pwordreset-request/pwordreset-request.component';
import { PwordresetSentComponent } from './pwordreset/pwordreset-sent/pwordreset-sent.component';
import { PwordresetChangeComponent } from './pwordreset/pwordreset-change/pwordreset-change.component';
import { MemberInputComponent } from './dashboard/ra-admin/ra-create-channel/create-channel-form/member-input/member-input.component';

import { ChannelNavBarService } from './home/interface/channel-nav-bar/channel-nav-bar.service';
import { HdNotificationsComponent } from './dashboard/hd-admin/hd-notifications/hd-notifications.component';
import { CreatePmComponent } from './dashboard/pm-interface/pm-side-panel/create-pm/create-pm.component';
import { BotMessageComponent } from './home/interface/messages/bot-message/bot-message.component';
import { MuteMembersComponent } from './home/interface/mute-members/mute-members.component';
import { PollingComponent } from './home/interface/channel-nav-bar/polling/polling.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignUpHdComponent,
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
    RaCreateChannelComponent,
    PwordresetRequestComponent,
    PwordresetSentComponent,
    PwordresetChangeComponent,
    ChannelPanelComponent,
    FloorDrawerComponent,
    ErrorComponent,
    CreateChannelFormComponent,
    HdAdminComponent,
    MemberInputComponent,
    PmInterfaceComponent,
    PmSidePanelComponent,
    NewPmComponent,
    PrivateMessagesComponent,
    MessageComponent,
    UserManagementComponent,
    HdNotificationsComponent,
    CreatePmComponent,
    UserManagementComponent,
    RequestChannelComponent,
    RequestChannelFormComponent,
    RaChannelRequestsComponent,
    LeaveChannelDialog,
    DeleteChannelDialog,
    ImageModalComponent,
    BotMessageComponent,
    AssignPrivilegsComponent,
    MuteMembersComponent,
    MoveUsersComponent,
    PollingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'rezzi'),
    AngularFireDatabaseModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,
    MatGridListModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    NgbModule,
    MatTabsModule,
    MatSelectModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatRadioModule
  ],
  entryComponents: [
    JoinChannelComponent,
    CreatePmComponent,
    LeaveChannelDialog,
    DeleteChannelDialog,
    ImageModalComponent,
    PollingComponent
  ],
  providers: [MessagesService, ChannelNavBarService],
  bootstrap: [AppComponent]
})
export class AppModule {}
