import { MessageLogDetailTypeService } from './../../../shared/services/messagelogdetailtype.service';
import { MessageLogDetailService } from './../../../shared/services/messagelogdetail.service';
import { AuthService } from './../../../shared/services/auth.service';
import { Job } from './../../../shared/models/job.model';
import { JobService } from './../../../shared/services/job.service';
import { AddPersonjobDialogComponent } from './add-personjob-dialog/add-personjob-dialog.component';
import { AddDetailDialogComponent } from './add-detail-dialog/add-detail-dialog.component';
import { MessageLogDetail, MessageLogDetailType } from './../../../shared/models/messagelogdetail.model';
import { PersonService } from './../../../shared/services/person.service';
import { Person } from './../../../shared/models/person.model';
import { DatePipe } from '@angular/common';
import { MessageService } from './../../../shared/services/message.service';
import { PersonJobService } from './../../../shared/services/personjob.service';
import { Message } from './../../../shared/models/message.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonJob } from '../../../shared/models/personjob.model';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-person-jobs',
  templateUrl: './person-jobs.component.html',
  styleUrls: ['./person-jobs.component.scss']
})
export class PersonJobsComponent implements OnInit, OnDestroy {

  hasRemarks= false;
  person: Person;
  personJobs: PersonJob[] = [];
  personJobsOrig: PersonJob[] = [];
  personMsgLogs: Message[] = [];
  jobs:Job[] = [];
  detailType: MessageLogDetailType[] = [];
  jobsLoaded = false;

  jobSubscription: Subscription = Subscription.EMPTY;
  jobsLoadedSubscription: Subscription = Subscription.EMPTY;
  personJobsSubscription: Subscription = Subscription.EMPTY;
  personMsgLogsSubscription: Subscription = Subscription.EMPTY;
  personServiceSubscription: Subscription = Subscription.EMPTY;
  detailTypsSubscription:Subscription =  Subscription.EMPTY;
  messageLogDetailSubscription:Subscription = Subscription.EMPTY;
  constructor(
    private personJobService: PersonJobService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private personService: PersonService,
    private jobService: JobService,
    private authService: AuthService,
    private messageLogDetailService: MessageLogDetailService,
    private messageLogDetailTypeService: MessageLogDetailTypeService,  
    public dialog:MatDialog
) { }


// shows dialog for adding comment
showAddDetail(msg: any) {
  const logid = msg.details[msg.details.length-1].logid;
  let dialogref = this.dialog.open(AddDetailDialogComponent, {
    data : logid
  })
  // add new comment to the log so it gets displayed
  dialogref.afterClosed().subscribe(res => {
    if (res){
      this.personMsgLogs.find(messg => messg.id === msg.id).messagelogs.find(log => log.id === logid).details.push(new MessageLogDetail(res.response));
      this.reorder();
    }
  })
}


// shows dialog for confirming job for person
showAddPersonJob(msg){
  const logid = msg.details[msg.details.length-1].logid
  let dialogref = this.dialog.open(AddPersonjobDialogComponent, {
    data : {msgid : msg.id, job: msg.job, personid : msg.messagelogs[0].person.id}
  })
  // add new personjob to the list
  dialogref.afterClosed().subscribe(
    res => {
      if (res){
        let pj = this.personJobsOrig.find(pj => pj.job === res.job);
        if (!pj){
          const logdetail = new MessageLogDetail({
            id : 0,
            comment : 'Person Confirmed for Job',
            created : undefined,
            modified : undefined,
            modified_by : this.authService.getUserId(),
            created_by : this.authService.getUserId(),
            messageLogDetailType : this.detailType.find(t => t.shortname === 'job_confirm')
          });
          this.personJobsOrig.push(new PersonJob(res))
          this.messageLogDetailSubscription = this.messageLogDetailService.saveLog(logdetail,  logid).subscribe(
            (resp) => {
              resp['messageLogDetailType'] = this.detailType.find(t => t.shortname ===  'job_confirm')
              this.personMsgLogs.find(messg => messg.id === msg.id).messagelogs.find(log => log.id === logid).details.push(new MessageLogDetail(resp));
              this.reorder();
          });
        }
        // this.reorder();
      }
    })
}

// rearranges the data for easier dsplay
reorder() {
  let localMsgLogs = this.personMsgLogs.slice();
  let pJobs =  this.personJobsOrig.slice();
  this.personJobs = this.personJobsOrig.slice();
  
  for (const pjob of this.personJobs){
    pjob.messages = [];
    pjob.job = this.jobs? this.jobs.find(job => job.id === pjob.job.id) : pjob.job;
    const msgs = localMsgLogs.filter(m => m.job.id === pjob.job.id);
    if (msgs.length > 0) {
      for (const msg of msgs) {
         const newMsg = msg;
         newMsg['details'] = this.getMessages(msg);
         pjob.messages.push(newMsg);
         const ind = localMsgLogs.indexOf(msg);
         localMsgLogs.splice(ind, 1);
     }
    }
  }
  for (const msg of localMsgLogs) {
    if (msg.job) {
     let newPersonJob = this.personJobs.find(job => job.job.id === msg.job.id);
     const newMsg = msg;
     newMsg['details'] = this.getMessages(msg);
     if (!newPersonJob) {
       newPersonJob = new PersonJob({
         'job' : msg.job,
        });
        this.personJobs.push(newPersonJob);
     }
     newPersonJob.messages.push(newMsg);
    }
  }
}

// will give color to icono (needs to be corrected to ui colors)
checkDate(job: PersonJob): string {
   const now = new Date();
   return job.job.dateuntil ? ((job.job.dateuntil < now) ? '#43a047' : '#0091ea') :
     (job.job.datefrom ? ((job.job.datefrom < now) ? '#43a047' : '#0091ea') : '#e53935');

 }


//  checkMessages(jobid: number): boolean {
//    return true; //this.personMsgLogs.some(m => (m.message.job ? m.message.job.id === jobid : false));
//    // return true;
//  }

// groups messagelogdetails for same message and person (groups mail & sms)
 getMessages(msg: Message): any[] {
   //  this.personMsgLogs;
   const ret: any[] = [];
   for (const log of msg.messagelogs) {
     for (const det of log.details) {
       const detail = {
         'logid' : log.id,
         'messagetype' : log.messageType,
         'created' : det.created,
         'comment' : det.comment,
         'detailType' : det.messageLogDetailType,
         'tooltip' : '[' + this.datePipe.transform(det.created, 'dd/MM HH:mm:ss') + '] ' + 
           log.messageType + ' : ' + det.messageLogDetailType.name 
       };
       ret.push(detail);
     }
   }
   return ret.sort((loga:any, logb:any) => {return loga.created.getTime() - logb.created.getTime()});
 }

 
subscribeJobs() {
  this.personJobsSubscription = this.personJobService.getPersonJobs(this.person.id).subscribe(
    ((personjobs) => {
      this.personJobsOrig = personjobs;
      this.subscribeMessages();
    }),
  );  
}

subscribeMessages() {
  this.personMsgLogsSubscription = this.messageService.getPersonMessages(this.person.id).subscribe(
    (logs) => {
      this.personMsgLogs = logs;  
      this.reorder(); 
    } 
  );
  this.personJobs.sort((joba: PersonJob, jobb: PersonJob) => {
    return jobb.job.datefrom.getTime() - joba.job.datefrom.getTime();
  });
}

loadJobs(){
  this.jobSubscription = this.jobService.jobs.subscribe((jobs)=>{
    this.jobs = jobs;
    this.personServiceSubscription = this.personService.selectedPerson.subscribe(
      (pers) => {
        this.person = pers;
        this.hasRemarks = this.person.personremarks.findIndex(rem => rem.subject === 'jobs')>-1;
        this.subscribeJobs();
      },
      (error) =>{console.log(error)},
     );
  
    });
}
ngOnInit() {
  this.detailTypsSubscription = this.messageLogDetailTypeService.getDetailTypes().subscribe(types => this.detailType = types);

  if (this.jobsLoaded)
  {
    this.loadJobs();
  }

  this.jobsLoadedSubscription = this.jobService.jobsLoaded.subscribe(load => {
    if (load){
      this.jobsLoaded = true;
      this.loadJobs()
    }
  })

  }
  ngOnDestroy(){
    this.jobSubscription.unsubscribe();
    this.personJobsSubscription.unsubscribe();
    this.personMsgLogsSubscription.unsubscribe();
    this.personServiceSubscription.unsubscribe();
    this.jobsLoadedSubscription.unsubscribe();
  }

}
