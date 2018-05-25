
export class Interviewer {
    public id: number;
    public name: string;

    constructor(interviewer: any){
        this.id = interviewer['id'];
        this.name = interviewer['name'];
    }
}
