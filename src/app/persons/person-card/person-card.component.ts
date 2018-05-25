import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SideNavService } from './../../shared/services/sidenav.service';
import { DatePipe } from '@angular/common';
// import { Message } from './../../shared/models/message.model';
// import { MessageService } from './../../shared/services/message.service';
// import { Job } from './../../shared/models/job.model';
// import { MessageLogService } from './../../shared/services/messagelog.service';
// import { MessageLogComplete, ContactMessageLog } from './../../shared/models/messagelog.model';
// import { PersonJob } from './../../shared/models/personjob.model';
// import { PersonJobService } from './../../shared/services/personjob.service';
import { PersonService } from './../../shared/services/person.service';
import { Person } from './../../shared/models/person.model';
import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatTabChangeEvent } from '@angular/material/tabs';


@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent implements OnInit, OnDestroy, OnChanges {
  

  person: Person;
  receivedId:number = 0;
  doneLoading = false;
  tabheight = 400;
  personSubsription: Subscription = Subscription.EMPTY;
  routeSubsription: Subscription = Subscription.EMPTY;
  persLoadedSubsription: Subscription = Subscription.EMPTY;
  tabHeightSubsription: Subscription = Subscription.EMPTY;
  hasRemarks = false;
  hasStickyRemark = false;
  constructor(
    private personService: PersonService,
    private datePipe: DatePipe,
    private sideNavService: SideNavService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  tabChange(e: MatTabChangeEvent) {
  }
  checkParamMap(){
    this.routeSubsription = this.activatedRoute.queryParams.subscribe((pMap)=>{
      this.receivedId = 0
      if (pMap.id){
        if (typeof +pMap.id === 'number'){
          this.receivedId = +pMap.id;
        }
      }
    });
  }

getPerson(){
  if (this.receivedId > 0){
    const newPers = this.personService.getPerson(this.receivedId);
    if (newPers instanceof Person){
      this.personService.selectedPerson.next(newPers);
    }
    this.receivedId = 0;

  }
}

  closeMe() {
    this.sideNavService.toggleRightNav('close');
    this.router.navigate(['persons']);
  }
  ngOnInit() {
    // console.log(this.activatedRoute)
    this.persLoadedSubsription = this.personService.personsLoaded.subscribe(loaded => {
      if (loaded) {
        this.getPerson();
        this.doneLoading = true;
      }
    });
    this.checkParamMap()
    this.personSubsription =  this.personService.selectedPerson.subscribe(
      (pers: Person) => {
        if (this.receivedId >0 && this.receivedId !== pers.id && this.doneLoading) {
          this.getPerson();
        } else {
          this.person = pers;
          this.hasRemarks = this.person.personremarks.findIndex(rem => rem.subject === 'general')>-1;
          this.hasStickyRemark = this.person.personremarks.findIndex(rem => rem.sticky === true)>-1;
          setTimeout(() => {
            this.sideNavService.setTabHeight()
          }, );
        }
    });
    this.tabHeightSubsription = this.sideNavService.tabHeight.subscribe(height=> this.tabheight = height);

  }
  ngOnDestroy() {
    this.personSubsription.unsubscribe();
    this.persLoadedSubsription.unsubscribe();
    this.sideNavService.toggleRightNav('close');
    this.tabHeightSubsription.unsubscribe();
  }
  ngAfterViewInit(){
    setTimeout(() => {
        this.sideNavService.toggleRightNav('person-card');
        this.sideNavService.setTabHeight();
        
    }); 
  }

  ngOnChanges(){
    this.sideNavService.setTabHeight();

  }
}
