export class JobType {
    public id: number;
    public name: string;
    public description: string;
    constructor(jobtype: any) {
        this.id = jobtype['id'] ?  jobtype['id'] : undefined;
        this.name = jobtype['name'] ? jobtype['name'] : undefined;
        this.description = jobtype['description'] ? jobtype['description'] : undefined;
    }
}
