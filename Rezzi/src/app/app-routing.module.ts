import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { WelcomeComponent } from './welcome/welcome.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpHdComponent } from './sign-up-hd/sign-up-hd.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// Routes
const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-up-hd', component: SignUpHdComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'create-channel', component: CreateChannelComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
