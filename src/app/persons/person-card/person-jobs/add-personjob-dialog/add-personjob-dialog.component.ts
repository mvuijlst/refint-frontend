import { DatePipe } from '@angular/common';
import { Person } from './../../../../shared/models/person.model';
import { Job } from './../../../../shared/models/job.model';
import { PersonJob } from './../../../../shared/models/personjob.model';
import { PersonJobService } from './../../../../shared/services/personjob.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-add-personjob-dialog',
  templateUrl: './add-personjob-dialog.component.html',
  styleUrls: ['./add-personjob-dialog.component.scss']
})
export class AddPersonjobDialogComponent implements OnInit, OnDestroy {

  datefrom:FormControl;
  dateuntil:FormControl;
  personJobSubscription:Subscription = Subscription.EMPTY;
  personjobForm: FormGroup;
  resp:any;
  constructor(
    public dialogRef: MatDialogRef<AddPersonjobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personJobService: PersonJobService,
  ) { }



  confirmJob() {
    console.log(this.personjobForm);
    const newPersonJob = new PersonJob({
      job : new Job({id:this.data.job.id}),
      person : this.data.personid,
      datefrom : this.personjobForm.value['datefrom'],
      dateuntil: this.personjobForm.value['dateuntil'],
      comments :  this.personjobForm.value['comment']
    })
    this.personJobSubscription  = this.personJobService.savePersonJob(newPersonJob).subscribe(resp =>
      { this.resp = resp;
        console.log(resp);
        this.closeDialog();
      });
    console.log(newPersonJob)

  }


  closeDialog(){
    console.log(this.resp)
    this.dialogRef.close(this.resp);
  }
  ngOnInit() {
    this.personjobForm = new FormGroup({
      'datefrom': new FormControl((this.data.job.datefrom < new Date()) ? new Date() : this.data.job.datefrom),
      'dateuntil' : new FormControl(this.data.job.dateuntil),
      'comment': new FormControl(null),
      });
    console.log(this.data);
  }

  ngOnDestroy(){
    this.personJobSubscription.unsubscribe();
  }

}
