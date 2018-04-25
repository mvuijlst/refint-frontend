import { MatCheckbox } from '@angular/material/checkbox';
import { MessageLogService } from './../../shared/services/messagelog.service';
import { MessageLog, MessageType } from './../../shared/models/messagelog.model';
import { MessageService } from './../../shared/services/message.service';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
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
import { AuthService } from '../../shared/services/auth.service';
import { subscriptionLogsToBeFn } from 'rxjs/testing/TestScheduler';

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
  @ViewChild('confirmStep') private confirmStep: TdStepComponent;

  messageForm: FormGroup;
  constructor(
    private personService: PersonService,
    private jobService: JobService,
    private eventService: EventService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private msgService: MessageService,
    private msgLogService: MessageLogService
      ) { }


  selectedPersons: Person[] = [];
  selectedMessageType = this.contactReasons[0];
  selectedItem: any; // Will hold Job or Event
  // Maybe we should block selectedPersonsSubscription once message is no longer empty?
  currentMessage: Message;

  savingmessage = false;
  selectedPersonsSubscription: Subscription = Subscription.EMPTY;
  linkedItemsSubscription: Subscription = Subscription.EMPTY;
  msgSubscription: Subscription = Subscription.EMPTY;

  message: Message;

  stepStateReason: StepState = StepState.None;
  stepStateLinkedItem: StepState = StepState.None;
  stepStateSMS: StepState = StepState.None;
  stepStateMail: StepState = StepState.None;
  stepStateConfirm: StepState = StepState.None;

  linkedItems: any[] = [];


  reasonChange(e: MatSelectChange) {
    console.log(e);
    if (+e.value.id !== 0) {
      this.stepStateReason = StepState.Complete;
      this.reasonStep.close();
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
    if (+e.value.id === 1 || +e.value.id === 2) {
      this.linkedItemStep.active = true;
      this.linkedItemStep.disabled = false;
      this.linkedItemStep.open();
      console.log('opnelinek');
      this.stepStateLinkedItem = StepState.Required;
    } else {
      this.linkedItems = [];
      this.linkedItemsSubscription.unsubscribe();
      this.linkedItemStep.disabled = true;
    }
    if (+e.value.id === 3) {
      this.stepStateLinkedItem = StepState.None;
      this.linkedItemStep.label = 'Job - Event';
      this.linkedItemStep.sublabel = 'Geen job of event nodig';
      this.mailStep.disabled = false;
      this.smsStep.disabled = false;
      this.smsStep.open();
    }
    if (+e.value.id === 0) {
      this.mailStep.disabled = true;
      this.smsStep.disabled = true;
      this.confirmStep.disabled = true;
    }
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
    if (+e.value.id > 0){
      this.linkedItemStep.sublabel = 'Gekozen ' +
        ((e.value instanceof Job) ? 'Job ' : 'Event ') +
        this.datePipe.transform(e.value.dateFrom, 'dd/MM/yy') + ' - ' +
         e.value.name + ' - ' + ((e.value.location) ? e.value.location.name : '');
      this.stepStateLinkedItem = StepState.Complete;
      }
  }

  linkedItemConfirm(): void {
    this.selectedItem = this.messageForm.get('linkedItem').value;
    this.linkedItemStep.close();
    this.linkedItemStep.active = true;
    this.stepStateLinkedItem = StepState.Complete;
    this.smsStep.disabled = false;
    this.smsStep.active = true;
  }

  initMsgFormGroup(type: string): FormGroup {
    return this.formBuilder.group({
      'onderwerp': new FormControl(null, (type === 'mail') ? Validators.required : {}),
      'msg': new FormControl(null, Validators.required),
      'infoLink': new FormControl(null),
      'yesLink': new FormControl(null),
      'noLink': new FormControl(null)
    });
  }

  confirmMsg(stepname: string, skip: boolean): void {
    const step: TdStepComponent = (stepname === 'sms') ? this.smsStep : this.mailStep;
    const nextStep: TdStepComponent = (stepname === 'sms') ? this.mailStep : this.confirmStep;
    const fGroup: FormGroup = (stepname === 'sms') ?
      (<FormGroup>this.messageForm.get('smsMsg')) : (<FormGroup>this.messageForm.get('mailMsg'));
    if (skip) {
      step.active = false;
      step.state = StepState.None;
      step.sublabel = 'geen boodschap';
      step.close();
    } else {
      console.log(fGroup.valid);
      if (fGroup.valid) {
        step.disabled = false;
        step.state = StepState.Complete;
        step.close();
      } else {
        nextStep.disabled = true;
        nextStep.active = false;
        return;
      }
    }
    nextStep.active = true;
    nextStep.disabled = false;
    nextStep.open();
  }

  sendMsg() {
    this.msgSubscription = this.msgService.sendMessage(this.currentMessage).subscribe(resp=>{
      console.log(resp);
    });
  }

  createMsg(e) {
    console.log(e);
    this.savingmessage = true;

    const jobId = this.selectedMessageType.name.toLowerCase() === 'job' ? (<Job>this.messageForm.get('linkedItem').value).id : null;
    const eventId = this.selectedMessageType.name.toLowerCase() === 'event' ? (<Job>this.messageForm.get('linkedItem').value).id : null;
    const subject = ((this.messageForm.get('mailMsg').get('onderwerp').value)) ?
      this.messageForm.get('mailMsg').get('onderwerp').value :
      this.messageForm.get('smsMsg').get('onderwerp').value;
    const msgtypes: string[] = [];
    if (this.messageForm.get('mailMsg').get('msg').value) {msgtypes.push('mail'); }
    if (this.messageForm.get('smsMsg').get('msg').value) {msgtypes.push('sms'); }
    const mGroup: FormGroup = (<FormGroup>this.messageForm.get('mailMsg'));

    console.log((this.messageForm.get('mailMsg').get('infoLink')));
    const newMsg: Message = new Message(
      null,
      subject,
      this.messageForm.get('mailMsg').get('msg').value,
      (this.messageForm.get('mailMsg').get('infoLink').value) ? this.messageForm.get('mailMsg').get('infoLink').value : false,
      (this.messageForm.get('mailMsg').get('yesLink').value) ? this.messageForm.get('mailMsg').get('yesLink').value : false,
      (this.messageForm.get('mailMsg').get('noLink').value) ? this.messageForm.get('mailMsg').get('noLink').value : false,
      this.messageForm.get('smsMsg').get('msg').value,
      (this.messageForm.get('smsMsg').get('infoLink').value) ? this.messageForm.get('smsMsg').get('infoLink').value : false,
      (this.messageForm.get('smsMsg').get('yesLink').value) ? this.messageForm.get('smsMsg').get('yesLink').value : false,
      (this.messageForm.get('smsMsg').get('noLink').value) ? this.messageForm.get('smsMsg').get('noLink').value : false,
      eventId,
      jobId,
      new Date(),
      this.authService.getUserId(),
      null,
      null,
      this.createMsgLogs(msgtypes, null));
    console.log(newMsg);
    this.msgService.saveMessage(newMsg);
    this.msgSubscription  = this.msgService.saveMessage(newMsg).subscribe(msg => {
        this.currentMessage = msg;
    });
  }

  createMsgLogs(msgtypes: string[], messageId:number): MessageLog[] {
    const msgLog: MessageLog[] = [];
    this.selectedPersons.forEach(person => {
      msgtypes.forEach(msgtype => {
        msgLog.push (
          new MessageLog(
            undefined,
            null,
            msgtype === 'sms' ? MessageType.SMS : MessageType.MAIL,
            person.id));
        });
        });
    return msgLog;
  }

  ngOnInit() {
    this.messageForm = new FormGroup({
      'messageType': new FormControl(this.contactReasons[0]),
      'linkedItem': new FormControl(null),
      'onderwerp': new FormControl(null),
      'smsMsg': this.initMsgFormGroup('sms'),
      'mailMsg': this.initMsgFormGroup('mail')
      });

    this.selectedPersonsSubscription = this.personService.selectedPersons.subscribe(persons => this.selectedPersons = persons);
    console.log(this.selectedMessageType);
  }
  ngOnDestroy() {
    this.selectedPersonsSubscription.unsubscribe();
    this.linkedItemsSubscription.unsubscribe();
    this.msgSubscription.unsubscribe();
  }
}
