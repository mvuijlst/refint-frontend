export class Status {
    public id:string;
    public name : JobStatus;

    constructor(status: any) {
        this.id = status;
        switch(status){
            case "B":{ 
                this.name = JobStatus.B;
                break;
            }
            case "C":{ 
                this.name = JobStatus.C;
                break;
            }
            case "V":{ 
                this.name = JobStatus.V;
                break;
            }
            default:{
                this.name = JobStatus.U;
                break;

            }
        }
        

    }
}
export enum JobStatus {
    C = 'Contact',
    B = 'Bevestigd',
    V = 'Vraag',
    U = 'Ongekend',
}
