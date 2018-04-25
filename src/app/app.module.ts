import { JobTypeService } from './shared/services/jobtype.service';
import { MessageLogService } from './shared/services/messagelog.service';
import { MessageService } from './shared/services/message.service';
import { JobService } from './shared/services/job.service';
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
import { EventService } from './shared/services/event.service';
import { DatePipe } from '@angular/common';

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
    DatePipe,
    PersonService,
    JobService,
    EventService,
    MessageService,
    MessageLogService,
    JobTypeService,
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
