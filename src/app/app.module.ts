import { PersonsGuardGuard } from './shared/guards/persons-guard.guard';
import { StepperDenseComponent } from './shared/message-stepper/stepper-dense/stepper-dense.component';
import { MessageStepperComponent } from './shared/message-stepper/message-stepper.component';
import { ErrorService } from './shared/services/error.service';
import { IntakeComponent } from './persons/person-card/intake/intake.component';

import { PersonJobService } from './shared/services/personjob.service';
import { MessageLogDetailService } from './shared/services/messagelogdetail.service';
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
import { SideNavService } from './shared/services/sidenav.service';
import { MessagesComponent } from './messages/messages.component';
import { HomeComponent } from './home/home.component';
import { MessageLogDetailTypeService } from './shared/services/messagelogdetailtype.service';
import { OrientationComponent } from './persons/person-card/orientation/orientation.component';
import { PersonJobsComponent } from './persons/person-card/person-jobs/person-jobs.component';
import { ErrorComponent } from './error/error.component';
import { MessagecompleteComponent } from './persons/messagecomplete/messagecomplete.component';
import { TimelineDialogComponent } from './persons/person-card/timeline-dialog/timeline-dialog.component';
import { AddDetailDialogComponent } from './persons/person-card/person-jobs/add-detail-dialog/add-detail-dialog.component';
import { AddPersonjobDialogComponent } from './persons/person-card/person-jobs/add-personjob-dialog/add-personjob-dialog.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { SuccessionComponent } from './succession/succession.component';
import { JobCardBasicComponent } from './jobs/job-card-basic/job-card-basic.component';
import { MessageCardComponent } from './persons/contact/message-card/message-card.component';
import { JobsComponent } from './jobs/jobs.component';
import { LastRemarkComponent } from './persons/remarks/last-remark/last-remark.component';
import { RemarksComponent } from './persons/remarks/remarks/remarks.component';
import { GeneralComponent } from './persons/person-card/general/general.component';
import { ConfirmMessageComponent } from './messages/confirm-message/confirm-message.component';
import { JobCardComponent } from './jobs/job-card/job-card.component';
import { JobPersonsComponent } from './jobs/job-card/job-persons/job-persons.component';
import { JobMessagesComponent } from './jobs/job-card/job-messages/job-messages.component';
import { PersonTileComponent } from './persons/person-tile/person-tile.component';
import { JobPersonsOptionsComponent } from './jobs/job-card/job-persons-options/job-persons-options.component';


@NgModule({
  declarations: [
    AppComponent,
    PersonsComponent,
    PersonCardComponent,
    ContactComponent,
    LoginComponent,
    MessagesComponent,
    HomeComponent,
    IntakeComponent,
    OrientationComponent,
    PersonJobsComponent,
    ErrorComponent,
    TimelineDialogComponent,
    MessagecompleteComponent,
    AddDetailDialogComponent,
    AddPersonjobDialogComponent,
    SuccessionComponent,
    MessageStepperComponent,
    JobCardBasicComponent,
    MessageCardComponent,
    JobsComponent,
    LastRemarkComponent,
    RemarksComponent,
    GeneralComponent,
    ConfirmMessageComponent,
    JobCardComponent,
    JobPersonsComponent,
    JobMessagesComponent,
    StepperDenseComponent,
    PersonTileComponent,
    JobPersonsOptionsComponent,
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
    SideNavService,
    MessageLogDetailTypeService,
    MessageLogDetailService,
    PersonJobService,
    ErrorService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptorService,
      multi: true
    },
    AuthGuardService,
    {provide: MAT_DATE_LOCALE, useValue: 'nl-be'},    
    PersonsGuardGuard,
    
    ],
  entryComponents: [
      TimelineDialogComponent,
      AddDetailDialogComponent,
      AddPersonjobDialogComponent
    ],
    
  bootstrap: [AppComponent]
})
export class AppModule { }
