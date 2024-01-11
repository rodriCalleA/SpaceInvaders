import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordsComponent } from './records/records.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: 'records', component: RecordsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'preferences', component: PreferencesComponent},
  { path: 'game', component: GameComponent},
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: '**', redirectTo: '/game', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule implements OnInit {

  constructor() { }

  ngOnInit() {
  }

 }
