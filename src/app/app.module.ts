import { AuthGuardService } from './shared/services/auth-guard.service';
import { RequestInterceptorService } from './shared/interceptors/request.interceptor';
import { AuthService } from './shared/services/auth.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared/shared.module';

import { PersonService } from './shared/services/person.service';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { PersonsComponent } from './persons/persons.component';
import { AppRoutingModule } from '../app-routing.module';
import { PersonCardComponent } from './persons/person-card/person-card.component';
import { ContactComponent } from './persons/contact/contact.component';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PersonsComponent,
    PersonCardComponent,
    ContactComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    RouterModule.forRoot([]),
  ],
  providers: [
    PersonService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptorService,
      multi: true
    },
    AuthGuardService
    ],
    entryComponents: [
      LoginComponent
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }