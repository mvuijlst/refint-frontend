import { Person } from './../../../shared/models/person.model';
import { PersonService } from './../../../shared/services/person.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit, OnDestroy {

  person: Person;
  personSubsciption : Subscription = Subscription.EMPTY
  constructor(private personService: PersonService,) { }

  ngOnInit() {
    this.personSubsciption = this.personService.selectedPerson.subscribe(pers => this.person = pers);
  }
  ngOnDestroy(){
    this.personSubsciption.unsubscribe;
  }
}
