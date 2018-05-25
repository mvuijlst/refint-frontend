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
import { Component, OnInit, ViewChild, OnDestroy, Output } from '@angular/core';
import { StepState, TdStepComponent } from '@covalent/core/steps';
import { PersonService } from '../../shared/services/person.service';
import { Subscription } from 'rxjs/Subscription';
import { MatSelectChange } from '@angular/material/select';
import { ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Event } from '../../shared/models/event.model';
import { AuthService } from '../../shared/services/auth.service';
import { EventEmitter } from 'events';
import { SideNavService } from '../../shared/services/sidenav.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
    // encapsulation: ViewEncapsulation.None,
})


export class ContactComponent implements OnInit, OnDestroy {

  contactReasons = [
    {id: 0, name: 'Kies Hier'},
    {id: 1, name: 'Job'},
    {id: 2, name: 'Event'},
    {id: 3, name: 'Andere'}];

  @ViewChild('reasonStep') private reasonStep: TdStepComponent;
  @ViewChild('linkedItemStep') private linkedItemStep: TdStepComponent;
  @ViewChild('smsStep') private smsStep: TdStepComponent;
  @ViewChild('confirmStep') private confirmStep: TdStepComponent;

  jobs: Job[] = [];
  events: Event[] = [];
  jobsLoaded = false;
  eventsLoaded = false;
  messageForm: FormGroup;
  constructor(
    private personService: PersonService,
    private jobService: JobService,
    private eventService: EventService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private msgService: MessageService,
    // private msgLogService: MessageLogService,
    private sideNavService: SideNavService,
    private router: Router,
    private activatedRoute : ActivatedRoute
  ) { }


  selectedPersons: Person[] = [];
  selectedMessageType = this.contactReasons[0];

  selectedItem: any; // Will hold Job or Event

  smsCount = 0;
  mailCount = 0;
  currentMessage: Message;
  messageComplete = false;
  savingmessage = false;
  selectedPersonsSubscription: Subscription = Subscription.EMPTY;
  linkedItemsSubscription: Subscription = Subscription.EMPTY;
  msgSubscription: Subscription = Subscription.EMPTY;
  routeSubscription: Subscription = Subscription.EMPTY;
  loadjobSubscription: Subscription = Subscription.EMPTY;
  loadeventSubscription: Subscription = Subscription.EMPTY;
  eventSubscription: Subscription = Subscription.EMPTY;

  message: Message;

  stepStateReason: StepState = StepState.None;
  stepStateLinkedItem: StepState = StepState.None;
  stepStateSMS: StepState = StepState.None;
  stepStateMail: StepState = StepState.None;
  stepStateConfirm: StepState = StepState.None;

  linkedItems: any[];



  setSteps(){
    console.log('set steps')
    this.setStepOne();
    this.setStepTwo();
    this.setStepThree();
  }

  setStepOne(){
    this.reasonStep.sublabel = this.selectedPersons.length.toString() +
      ' personen geslecteerd voor ' + this.selectedMessageType.name + ' [SMS : ' + 
        this.smsCount.toString() + '] [Mail : ' + this.mailCount.toString() + ']';

    this.reasonStep.active = true;
    this.reasonStep.disabled = false;
    if (this.selectedMessageType.id !== 0){
      this.reasonStep.state = StepState.Complete;
      this.reasonStep.close();
    }
    else{
      this.reasonStep.state = StepState.Required;
      this.reasonStep.open();
    }
  }

  setStepTwo() {
    this.linkedItemStep.sublabel = (this.selectedMessageType.id === 3) ? 'Ander Bericht' : '';
    this.linkedItemStep.state =  (this.selectedMessageType.id === 3) ? StepState.Complete : StepState.None;
    this.linkedItemStep.disabled = true;
    this.linkedItemStep.active = (this.selectedMessageType.id > 0) ? true : false;
    if (!this.selectedItem && (this.selectedMessageType.id === 1 || this.selectedMessageType.id === 2)){
      this.linkedItemStep.state = StepState.Required;
      this.linkedItemStep.label = 'Kies een ' + this.selectedMessageType.name;
      this.linkedItemStep.sublabel = 'Je bent verplicht een ' +  this.selectedMessageType.name + ' te kiezen';
      this.linkedItemStep.disabled= false;
      this.linkedItemStep.open();
    } 
    if (this.selectedItem || this.selectedMessageType.id === 3) {
      this.linkedItemStep.state = StepState.Complete;
      this.linkedItemStep.disabled = false;
      this.linkedItemStep.active = true;
      this.linkedItemStep.close();
      console.log(this.selectedItem)
      this.linkedItemStep.sublabel = 'Gekozen ' +
        ((this.selectedItem instanceof Job) ? 'Job ' : (this.selectedItem instanceof Event) ?  'Event' : 
        'Andere')
      if (this.selectedItem) {
        this.linkedItemStep.sublabel += this.datePipe.transform(this.selectedItem.datefrom, 'dd/MM/yy') + ' - ' +
        this.datePipe.transform(this.selectedItem.dateuntil, 'dd/MM/yy') + ' - ' +
        this.selectedItem.name + ' - ' + ((this.selectedItem.location) ? this.selectedItem.location.name : '');
      }
    }
  }

  setStepThree() {
    console.log('step3 ')
    console.log(this.linkedItemStep.state  );
    if (this.linkedItemStep.state === 'complete') {
      this.smsStep.disabled = false;
      this.smsStep.active = true;
      this.smsStep.open();
    } else {
      this.smsStep.disabled = true;
      this.smsStep.active = false;
      this.smsStep.close();
      
    }


  }

  reasonChange(e: MatSelectChange) {
    if ((this.selectedItem instanceof Job && this.selectedMessageType.name !== 'Job') || 
      (this.selectedItem instanceof Event && this.selectedMessageType.name !== 'Event') 
      ) {
        this.selectedItem = null;
    }
    switch (this.selectedMessageType.name){
      case 'Job':{
        this.linkedItems = this.jobs;
        break;
      }
      case 'Event': {
        this.linkedItems = this.events;
        break;
      }
    }
    if (this.selectedMessageType.id !== 3) {
    this.linkedItems = this.linkedItems.filter(item => item.dateuntil ? item.dateuntil.getTime() > new Date() :
    item.datefrom ? item.datefrom.getTime()> new Date() : true).sort(
      (a, b) => {
        return a.datefrom.getTime() - b.datefrom.getTime();
      }
    );
    } else {
      this.selectedItem = null;
    }

    this.setSteps();
  }

  linkedItemChange(e: MatSelectChange): void {
    
    console.log(e)
    if (+e.value.id > 0){
      this.linkedItemStep.sublabel = 'Gekozen ' +
        ((e.value instanceof Job) ? 'Job ' : 'Event ') +
        this.datePipe.transform(e.value.datefrom, 'dd/MM/yy') + ' - ' +
        this.datePipe.transform(e.value.dateuntil, 'dd/MM/yy') + ' - ' +
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
      'mail': new FormControl(null),
      'sms': new FormControl(null),
      'confirmlink': new FormControl(null)
    });
  }

  confirmMsg(stepname: string, skip: boolean): void {
    // const step: TdStepComponent = (stepname === 'sms') ? this.smsStep : this.mailStep;
    // const nextStep: TdStepComponent = (stepname === 'sms') ? this.mailStep : this.confirmStep;
    // const fGroup: FormGroup = (stepname === 'sms') ?
    //   (<FormGroup>this.messageForm.get('smsMsg')) : (<FormGroup>this.messageForm.get('mailMsg'));
    const step: TdStepComponent = this.smsStep;
    const nextStep: TdStepComponent = this.confirmStep;
    const fGroup: FormGroup = (<FormGroup>this.messageForm.get('smsMsg'));
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



  createMsg(e) {
    console.log(e);
    this.savingmessage = true;

    const jobId = this.selectedMessageType.name.toLowerCase() === 'job' ? (<Job>this.messageForm.get('linkedItem').value).id : null;
    const eventId = this.selectedMessageType.name.toLowerCase() === 'event' ? (<Job>this.messageForm.get('linkedItem').value).id : null;
    const subject = this.messageForm.get('smsMsg').get('onderwerp').value;
    const sendSms = this.messageForm.get('smsMsg').get('sms').value
    const sendMail = this.messageForm.get('smsMsg').get('mail').value
    // ((this.messageForm.get('mailMsg').get('onderwerp').value)) ?
    //   this.messageForm.get('mailMsg').get('onderwerp').value :
    //   this.messageForm.get('smsMsg').get('onderwerp').value;
    const msgtypes: string[] = [];

    if (sendMail) {msgtypes.push('mail'); }
    if (sendSms) {msgtypes.push('sms'); }
    const mGroup: FormGroup = (<FormGroup>this.messageForm.get('mailMsg'));
    const logs = this.createMsgLogs(msgtypes, null);
    const newMsg: Message = new Message(
      {
        'id' : null,
        'subject' : subject,
        'message_mail' : sendMail ?  this.messageForm.get('smsMsg').get('msg').value : undefined,
        'infolink_mail' : sendMail,
        'confirmlink_mail' : sendMail ?  this.messageForm.get('smsMsg').get('confirmlink').value : undefined,
        'deniallink_mail' : undefined,
        'message_sms' : sendSms ? this.messageForm.get('smsMsg').get('msg').value : undefined,
        'infolink_sms' : sendSms,
        'confirmlink_sms' : sendMail ?  this.messageForm.get('smsMsg').get('confirmlink').value : undefined,
        'deniallink_sms' : undefined,
        'event' : eventId ? new Event({'id' : eventId}) : null,
        'job' : jobId ? new Job({'id' : jobId}) : null,
        'created' : new Date(),
        'created_by' : this.authService.getUserId(),
        'modified_by' : this.authService.getUserId(),
        'messageLogs' : logs,
      });
      this.msgSubscription  = this.msgService.saveMessage(newMsg).subscribe(msg => {
        this.currentMessage = msg;
        this.messageComplete = true;
        this.router.navigate(['persons','message']);
    });
  }

  createMsgLogs(msgtypes: string[], messageId: number): MessageLog[] {
    const msgLog: MessageLog[] = [];
    this.selectedPersons.forEach(person => {
      msgtypes.forEach(msgtype => {
        if ((msgtype === 'sms' && person.defaultMobile !== '') ||
         (msgtype === 'mail' && person.defaultMail !== '')) {
        msgLog.push (
          new MessageLog({
            'id' : undefined,
            'twilio_message_id' : undefined,
            'messageType' : msgtype === 'sms' ? MessageType.SMS : MessageType.MAIL,
            'person' : {'id' : person.id},
            // 'message' : 'null'
          }));
          }
        });
        });
    return msgLog;
  }

  closeMe() {
    this.sideNavService.toggleRightNav('close');
    this.router.navigate(['persons']);
  }

  checkParams() {
      this.routeSubscription = this.activatedRoute.queryParams.subscribe((pMap)=>{
        if (pMap.jobid){
          if (typeof +pMap.jobid === 'number'){
            // weg got a job let select
            console.log('we got a job');
            this.linkedItems = this.jobs;
            this.selectedMessageType = this.contactReasons[1];
            // this.messageForm.patchValue({'messageType' : this.contactReasons[1]});
            console.log(this.linkedItems)
            this.selectedItem = this.jobService.getJob(+pMap.jobid);
            // this.messageForm.patchValue({'linkedItem' : this.selectedItem});
            console.log(this.selectedItem)
            // if (this.linkedItems.findIndex(it => it.id === this.selectedItem.id) === -1){
            //    this.linkedItems.push(this.selectedItem);
            // }
            // this.setStepOne();
            }
        }
        this.setSteps()
        console.log(pMap);
      });
    }
  
  ngOnInit() {
    this.messageForm = new FormGroup({
      'messageType': new FormControl( this.selectedMessageType),
      'linkedItem': new FormControl(null),
      'onderwerp': new FormControl(null),
      'smsMsg': this.initMsgFormGroup('sms'),
    });

    this.linkedItemsSubscription = this.jobService.jobs.subscribe(jobs => this.jobs = jobs);
    this.eventSubscription = this.eventService.events.subscribe(events => this.events = events);

    this.selectedPersonsSubscription = this.personService.selectedPersons.subscribe(
      (persons) => {
        this.selectedPersons = persons;
        this.smsCount = this.selectedPersons.filter(pers => pers.defaultMobile !== '').length
        this.mailCount = this.selectedPersons.filter(pers => pers.defaultMail !== '').length
      });
      this.loadjobSubscription = this.jobService.jobsLoaded.subscribe(loaded => {
        this.jobsLoaded = loaded;
        // if (this.jobsLoaded && this.eventsLoaded){
        //   this.checkParams()
        // }
      });
      this.loadeventSubscription = this.eventService.eventsLoaded.subscribe(loaded => {
        this.eventsLoaded = loaded
        // if (this.jobsLoaded && this.eventsLoaded){
        //   this.checkParams()
        // }
      });
    }

  ngOnDestroy() {
    console.log('contact destroyed');
    this.selectedPersonsSubscription.unsubscribe();
    this.linkedItemsSubscription.unsubscribe();
    this.msgSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    if (!this.messageComplete){
      this.sideNavService.toggleRightNav('close');
    }
  }

  ngAfterViewInit() {
    // if (this.jobsLoaded && this.eventsLoaded){
       setTimeout(() => {
        this.checkParams(); 
        this.sideNavService.toggleRightNav('contact')
      })
    // }
//Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.checkParams();
  }
}
