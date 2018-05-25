import { Job } from './job.model';
import { Message } from './message.model';
export class PersonJob {
    public id: number;
    public job: Job;
    public datefrom: Date;
    public dateuntil: Date;
    public comments: string;
    public person: number;
    public messages: any[] = [];
    constructor (personjob: any) {
        this.id = personjob['id'] ? personjob['id'] : undefined;
        this.person = personjob['person'] ? personjob['person'] : undefined;
        this.job = new Job(personjob['job']);
        this.comments = personjob['comments'] ? personjob['comments'] : '';
        this.datefrom = personjob['datefrom'] ? new Date(personjob['datefrom']) : null;
        this.dateuntil = personjob['dateuntil'] ? new Date(personjob['dateuntil']) : null;
    }
}
