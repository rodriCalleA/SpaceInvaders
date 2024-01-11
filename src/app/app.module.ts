import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecordsRestService } from './shared/services/records-rest.service';
import { LoadingDialogComponent } from './loadingDialog/loadingDialog.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RecordsComponent } from './records/records.component';
import { AuthService } from './shared/services/auth.service';
import { AuthTokenInterceptorService } from './shared/services/interceptor.service';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameComponent } from './game/game.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmationDialogComponent } from './confirmationDialog/confirmationDialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LoadingDialogComponent,
    RecordsComponent,
    GameComponent,
    PreferencesComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    ConfirmationDialogComponent,
    FormsModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      closeButton: true,
      positionClass: 'toast-bottom-right',
    }),
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptorService,
      multi: true,
    },
    RecordsRestService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
