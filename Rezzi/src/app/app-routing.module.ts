import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// Components
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpHdComponent } from './sign-up-hd/sign-up-hd.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { CreateChannelComponent } from './create-channel/create-channel.component';

// Routes
const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-up-hd', component: SignUpHdComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-channel', component: CreateChannelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
