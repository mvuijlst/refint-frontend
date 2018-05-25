import { Status, JobStatus } from './status.model';
import { Organisation } from './organisation.model';
import { Location } from './location.model';
import { JobType } from './jobtype.model';

export class Job {
    public id: number;
        public organisation: Organisation;
        public name: string;
        public jobType: JobType;
        public permanent: boolean;
        public description: string;
        public status: Status;
        public location: Location;
        public contactPerson: string;
        public datefrom: Date;
        public dateuntil: Date;
        public personsId: number[];
    constructor(job: any) {
        
        if (typeof job === 'number'){
            this.id = job;
        } else{
            this.id = job['id'] ? job['id'] : undefined;
        }
        this.organisation = job['organisation'] ? new Organisation(job['organisation']) : undefined;
        this.name = job['name'] ? job['name'] : undefined;
        this.jobType = job['jobtype'] ? new JobType(job['jobtype']) : undefined;
        this.permanent = job['permanent'] ? job['permanent'] : undefined;
        this.description = job['description'] ? job['description'] : undefined;
        this.status = new Status(job['status']);



        this.location = job['location'] ? new Location(job['location']) : new Location({'id': 0, 'name' : 'ongekend', 'description': ''});
        this.contactPerson = job['contactperson'] ? job['contactperson'] : undefined;
        this.datefrom = job['datefrom'] ?
            job['datefrom'] instanceof Date ? job['datefrom'] : new Date(job['datefrom']) : undefined;
        this.dateuntil =  job['dateuntil'] ?
            job['dateuntil'] instanceof Date ? job['dateuntil'] :  new Date(job['dateuntil']) : undefined;
        this.personsId = job['persons'];
    }
}
