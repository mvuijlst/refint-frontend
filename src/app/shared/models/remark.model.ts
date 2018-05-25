import { Interviewer } from './interviewer.model';

export class Remark {
    public id:number;
    public subject: string;
    public content: string;
    public author: Interviewer;
    public sticky: boolean;
    public created: Date;
    public modified: Date;
    public constructor(remark: any){
        this.id = remark['id'];
        this.subject = remark['subject'];
        this.content = remark['content'];
        this.author = remark['author'] ? new Interviewer(remark['author']) : undefined;
        this.sticky = remark['sticky'];
        this.created = remark['created'] ? new Date(remark['created']): new Date();
        this.modified = remark['modified'] ? new Date(remark['created']): new Date();
    }
}