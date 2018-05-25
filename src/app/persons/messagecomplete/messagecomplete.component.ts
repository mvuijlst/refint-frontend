import { EventService } from './../../shared/services/event.service';
import { JobService } from './../../shared/services/job.service';
import { Job } from './../../shared/models/job.model';
import { SideNavService } from './../../shared/services/sidenav.service';
import { Subscription } from 'rxjs/Subscription';
import { Message } from './../../shared/models/message.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../../shared/services/message.service';

@Component({
  selector: 'app-messagecomplete',
  templateUrl: './messagecomplete.component.html',
  styleUrls: ['./messagecomplete.component.scss']
})
export class MessagecompleteComponent implements OnInit, OnDestroy {

  message:Message;
  messageSubscription: Subscription = Subscription.EMPTY;
  smsCount = 0;
  mailCount = 0;
  saveResponse: any;
  job: Job;
  sendbutDisabled = false;
  sendingMessage = false;

  constructor(
    private messageService:MessageService,
    private sideNavService: SideNavService,
    private jobService: JobService,
    private eventService: EventService
  ) { }

  sendMsg() {
    this.sendbutDisabled = true;
    this.sendingMessage = true;

    this.messageSubscription = this.messageService.sendMessage(this.message).subscribe(
      resp => {this.saveResponse = resp; this.sendingMessage = false;},
      (error) => {console.log(error)}
   );
  }
  closeMe(){
    this.sideNavService.toggleRightNav('close');
  }
  ngOnInit() {
    this.messageSubscription = this.messageService.savedMessage.subscribe((msg) => {
      this.message = msg;
      if (msg.job){
        this.message.job = this.jobService.getJob(msg.job.id);
      }
      if (msg.event){
         this.message.event = this.eventService.getEvent(msg.event.id);
      }
      console.log(this.message);
      this.smsCount = this.message.messagelogs.filter(log => log.messageType.toLowerCase() === 'sms').length;
      this.mailCount = this.message.messagelogs.filter(log => log.messageType.toLowerCase() === 'mail').length;
    })

  }
  ngOnDestroy(){
    this.messageSubscription.unsubscribe();
  }
}
