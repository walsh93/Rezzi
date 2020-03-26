import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { WelcomeComponent } from './welcome/welcome.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpHdComponent } from './sign-up-hd/sign-up-hd.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { InviteUsersComponent } from './dashboard/hd-admin/invite-users/invite-users.component';
import { RaCreateChannelComponent } from './dashboard/ra-admin/ra-create-channel/ra-create-channel.component';
import { ErrorComponent } from './error/error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PwordresetRequestComponent } from './pwordreset-request/pwordreset-request.component';
import { PwordresetSentComponent } from './pwordreset-sent/pwordreset-sent.component';
import { PwordresetChangeComponent } from './pwordreset-change/pwordreset-change.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './dashboard/hd-admin/user-management/user-management.component';
import { RequestChannelComponent } from './dashboard/request-channel/request-channel.component';
import { RaChannelRequestsComponent } from './dashboard/ra-admin/ra-channel-requests/ra-channel-requests.component';

// Routes
const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },                     // Page with all the hyperlinks
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-up-hd', component: SignUpHdComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'home', component: HomeComponent },
  { path: 'invite-users', component: InviteUsersComponent },
  { path: 'user-management', component: UserManagementComponent},
  { path: 'pword-reset-request', component: PwordresetRequestComponent},
  { path: 'pword-reset-sent', component: PwordresetSentComponent},
  { path: 'pword-reset-change', component: PwordresetChangeComponent},
  { path: 'create-channel', component: RaCreateChannelComponent },
  { path: 'err/:accountType/unauthorized', component: ErrorComponent }, // Error routes
  { path: 'dashboard', component: DashboardComponent },
  { path: 'request-channel', component: RequestChannelComponent },
  { path: 'channel-requests', component: RaChannelRequestsComponent },
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },              // Default path to sign-in
  { path: '**', component: PageNotFoundComponent },                     // MUST BE LAST
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
