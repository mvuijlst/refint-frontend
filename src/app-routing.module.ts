import { JobCardComponent } from './app/jobs/job-card/job-card.component';
import { JobsComponent } from './app/jobs/jobs.component';
import { SuccessionComponent } from './app/succession/succession.component';
import { MessagecompleteComponent } from './app/persons/messagecomplete/messagecomplete.component';
import { MessagesComponent } from './app/messages/messages.component';
import { HomeComponent } from './app/home/home.component';
import { AuthGuardService } from './app/shared/services/auth-guard.service';
import { ContactComponent } from './app/persons/contact/contact.component';
import { PersonCardComponent } from './app/persons/person-card/person-card.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { PersonsComponent } from './app/persons/persons.component';
import { LoginComponent } from './app/login/login.component';
import { AuthGuardService as AuthGuard } from './app/shared/services/auth-guard.service';
import { PersonsGuardGuard } from './app/shared/guards/persons-guard.guard';
const appRoutes: Routes = [
    { path: '', component: HomeComponent,  canActivate: [PersonsGuardGuard],
        children: [
            {path: 'persons', component: PersonsComponent, canActivate: [PersonsGuardGuard], children: [
                {path: 'person', component: PersonCardComponent},
                {path: 'message', component: MessagecompleteComponent},
                {path: 'contact', component: ContactComponent}]
            },
            {path: 'succession', component: SuccessionComponent},
            {path: 'jobs', component: JobsComponent, children: [
                {path: 'job', component:JobCardComponent}
            ]},
        ]
    },
    { path: 'messages/:id', component: MessagesComponent},
    { path: 'login', component: LoginComponent},
    // { path: 'persons', component: PersonsComponent, children:[
    //     {path: 'person', component: PersonCardComponent},
    //     {path: 'contact', component: ContactComponent}
    // ], canActivate :[AuthGuard]},
    { path: 'organizations', component: PersonsComponent},
    { path: 'events', component: PersonsComponent},
    { path: 'opvolging', component: PersonsComponent},
    { path: 'rapportage', component: PersonsComponent},
  ];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]

})

export class AppRoutingModule {}
