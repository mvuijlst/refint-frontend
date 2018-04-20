import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Message } from './../../shared/models/message.model';
import { Location } from './../../shared/models/location.model';
import { EventService } from './../../shared/services/event.service';
import { Job } from './../../shared/models/job.model';
import { JobService } from './../../shared/services/job.service';
import { Person } from './../../shared/models/person.model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { StepState, TdStepComponent } from '@covalent/core/steps';
import { PersonService } from '../../shared/services/person.service';
import { Subscription } from 'rxjs/Subscription';
import { MatSelectChange } from '@angular/material/select';
import { ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Event } from '../../shared/models/event.model';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ContactComponent implements OnInit, OnDestroy{

  contactReasons = [
    {id: 0, name: 'Kies Hier'},
    {id: 1, name: 'Job'},
    {id: 2, name: 'Event'},
    {id: 3, name: 'Andere'}];

  @ViewChild('reasonStep') private reasonStep: TdStepComponent;
  @ViewChild('linkedItemStep') private linkedItemStep: TdStepComponent;
  @ViewChild('smsStep') private smsStep: TdStepComponent;
  @ViewChild('mailStep') private mailStep: TdStepComponent;

  messageForm: FormGroup;
  constructor(
    private personService: PersonService,
    private jobService: JobService,
    private eventService: EventService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
      ) { }

  selectedPersons: Person[] = [];
  selectedPersonsSubscription: Subscription = Subscription.EMPTY;
  linkedItemsSubscription: Subscription = Subscription.EMPTY;
  selectedMessageType = this.contactReasons[0];
  selectedItem: any;

  message: Message;

  activeDeactiveStep1Msg: string = 'No select/deselect detected yet';
  stepStateReason: StepState = StepState.None;
  stepStateLinkedItem: StepState = StepState.None;
  stepStateSMS: StepState = StepState.None;
  stepStateMail: StepState = StepState.None;

  linkedItems: any[] = [];
  disabled: boolean = false;

  reasonChange(e: MatSelectChange) {
    if (+e.value.id > 0) {
      this.stepStateReason = StepState.Complete;
      if (+e.value.id > 0 && +e.value.id < 3) {
        this.stepStateLinkedItem = StepState.Required;
        this.linkedItemStep.active = true;
        this.linkedItemStep.disabled = false;
        this.linkedItemStep.open();
        }
      if (+e.value.id === 1) {
        this.subscribeJobs();
        this.linkedItemStep.label = 'Kies een Job';
        this.linkedItemStep.sublabel = 'Je bent verplicht een job te keizen';
      }
      if (+e.value.id === 2) {
        this.subscribeEvents();
        this.linkedItemStep.label = 'Kies een Event';
        this.linkedItemStep.sublabel = 'Je bent verplicht een event te keizen';
      }
      if (+e.value.id === 3) {
        this.linkedItems = [];
        this.linkedItemStep.close();
        this.linkedItemStep.disabled = true;
        this.stepStateLinkedItem = StepState.Complete;
      }
      this.reasonStep.close();
    }
  }

  openReasonStep() {
    this.linkedItemStep.close();
    this.selectedMessageType = this.contactReasons[0];
    this.linkedItems = [];
  }

  subscribeJobs(): void {
    if (this.linkedItems.length ===0 ||(this.linkedItems.length > 0 && !(this.linkedItems[0] instanceof Job))) {
      this.linkedItemsSubscription = this.jobService.getJobs().subscribe(jobs => this.linkedItems = jobs);
    }
  }
  subscribeEvents(): void {
    if (this.linkedItems.length === 0 || (this.linkedItems.length > 0 && !(this.linkedItems[0] instanceof Event))) {
      this.linkedItemsSubscription = this.eventService.getEvents().subscribe(events => this.linkedItems = events);
    }
  }
  linkedItemChange(e: MatSelectChange): void {
    this.selectedItem = e.value;
    if (+e.value.id > 0){
      this.linkedItemStep.sublabel = 'Gekozen ' +
        ((e.value instanceof Job) ? 'Job ' : 'Event ') +
        this.datePipe.transform(e.value.dateFrom, 'dd/MM/yy') + ' - ' +
         e.value.name + ' - ' + ((e.value.location) ? e.value.location.name : '');
      this.stepStateLinkedItem = StepState.Complete;
      }
    console.log(this.selectedItem);

  }
  linkedItemConfirm(): void {
    this.linkedItemStep.close();
    this.linkedItemStep.active = false;
    this.smsStep.disabled = false;
    this.smsStep.active = true;
  }

  initMsgFormGroup(){
    return this.formBuilder.group({
      'onderwerp': new FormControl(null),
      'msg': new FormControl(null),
      'infoLink': new FormControl(null),
      'yesLink': new FormControl(null),
      'noLink': new FormControl(null)
    });
  }

  confirmMsg(stepname: string, skip: boolean): void {
    const step: TdStepComponent = (stepname === 'sms') ? this.smsStep : this.mailStep;
    const nextStep: TdStepComponent = (stepname === 'sms') ? this.mailStep : null;
    if (skip) {
      step.active = false;
      step.state = StepState.None;
      step.sublabel = 'geen boodschap';
    }
    if (nextStep != null){
      nextStep.open();
      nextStep.active = true;
      nextStep.disabled = false;
    }
    console.log(step);

  }
  ngOnInit() {
    this.messageForm = new FormGroup({
      'messageType': new FormControl(this.contactReasons[0]),
      'linkedItem': new FormControl(null),
      'onderwerp': new FormControl(null),
      'smsMsg': this.initMsgFormGroup(),
      'mailMsg': this.initMsgFormGroup()
      });

    this.selectedPersonsSubscription = this.personService.selectedPersons.subscribe(persons => this.selectedPersons = persons);
    console.log(this.selectedMessageType);
  }
  ngOnDestroy() {
    this.selectedPersonsSubscription.unsubscribe();
    this.linkedItemsSubscription.unsubscribe();
  }
}
