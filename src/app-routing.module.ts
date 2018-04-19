import { AuthGuardService } from './app/shared/services/auth-guard.service';
import { ContactComponent } from './app/persons/contact/contact.component';
import { PersonCardComponent } from './app/persons/person-card/person-card.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { PersonsComponent } from './app/persons/persons.component';
import { LoginComponent } from './app/login/login.component';
import { AuthGuardService as AuthGuard } from './app/shared/services/auth-guard.service';
const appRoutes: Routes = [
    { path: '', component: PersonsComponent},
    { path: 'login', component: LoginComponent},
    { path: 'persons', component: PersonsComponent, children:[
        {path: 'person', component: PersonCardComponent},
        {path: 'contact', component: ContactComponent}
    ], canActivate :[AuthGuard]},
    { path: 'organizations', component: PersonsComponent},
    { path: 'jobs', component: PersonsComponent},
    { path: 'events', component: PersonsComponent},
    { path: 'opvolging', component: PersonsComponent},
    { path: 'rapportage', component: PersonsComponent},
  ];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]

})

export class AppRoutingModule {}
