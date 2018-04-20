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
        public status: string;
        public location: Location;
        public contactPerson: string;
        public dateFrom: Date;
        public dateUntil: Date;
        public personsId: number[];
    constructor(job: any) {
        this.id = job['id'];
        this.organisation =
            new Organisation(
                job['organisation']['id'],
                job['organisation']['name'],
                job['organisation']['logo'],
                job['organisation']['description']);
        this.name = job['name'];
        this.jobType =
            new JobType(
                job['jobtype']['id'],
                job['jobtype']['name'],
                job['jobtype']['description']);
        this.permanent = job['permanent'];
        this.description = job['description'];
        this.status = job['status'];
        if (job['location']){
            this.location =
                new Location(
                    job['location']['id'],
                    job['location']['name'],
                    job['location']['description'],
                );
            } else{
                this.location = new Location(0, 'ongekend', '');
            }
    
        this.contactPerson = job['contactperson'];
        this.dateFrom = job['datefrom'];
        this.dateUntil = job['dateuntil'];
        this.personsId = job['persons'];
    }
}
