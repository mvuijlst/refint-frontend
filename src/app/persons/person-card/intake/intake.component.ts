import { PersonService } from './../../../shared/services/person.service';
import { SideNavService } from './../../../shared/services/sidenav.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Person } from '../../../shared/models/person.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-intake',
  templateUrl: './intake.component.html',
  styleUrls: ['./intake.component.scss']
})
export class IntakeComponent implements OnInit, OnDestroy {

  personServiceSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private personService: PersonService
  ) { }
  person: Person;

  ngOnInit() {
    this.personServiceSubscription = this.personService.selectedPerson.subscribe(
      (pers) => {
        this.person = pers; 
      });
  }

  ngOnDestroy(){
    this.personServiceSubscription.unsubscribe();
  }
}
