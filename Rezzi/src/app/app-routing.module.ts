import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { WelcomeComponent } from './welcome/welcome.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpHdComponent } from './sign-up-hd/sign-up-hd.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PwordresetRequestComponent } from './resetpassword/pwordreset-request/pwordreset-request.component';
import { PwordresetSentComponent } from './resetpassword/pwordreset-sent/pwordreset-sent.component';
import { PwordresetChangeComponent } from './resetpassword/pwordreset-change/pwordreset-change.component';

// Routes
const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-up-hd', component: SignUpHdComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent },
  { path: 'pwordreset-request', component: PwordresetRequestComponent},
  { path: 'pwordreset-sent', component: PwordresetSentComponent},
  { path: 'pwordreset-change', component: PwordresetChangeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
