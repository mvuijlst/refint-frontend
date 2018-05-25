import { PersonService } from './../../../shared/services/person.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Person } from '../../../shared/models/person.model';

@Component({
  selector: 'app-orientation',
  templateUrl: './orientation.component.html',
  styleUrls: ['./orientation.component.scss']
})
export class OrientationComponent implements OnInit, OnDestroy {

  personServiceSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private personService: PersonService
  ) { }
  person: Person;

  ngOnInit() {
    this.personServiceSubscription = this.personService.selectedPerson.subscribe(pers => this.person = pers);
  }
  
  ngOnDestroy(){
    this.personServiceSubscription.unsubscribe();
  }
}
