export class MessageLogDetailType {
    public id: number;
    public icon: string;
    public style: string;
    public shortname: string;
    public name: string;
    constructor(mlogDetailType: any) {
        this.id = mlogDetailType['id'];
        this.icon = mlogDetailType['icon'];
        this.style = mlogDetailType['style'];
        this.shortname = mlogDetailType['shortname'];
        this.name =  mlogDetailType['name'];
    }
}

export class MessageLogDetail {
    public id: number;
    public messageLogDetailType: MessageLogDetailType;
    public created: Date;
    public created_by: string;
    public modified: Date;
    public modified_by: string;
    public comment: string;
    constructor(mlogDetail: any) {
        // console.log(mlogDetail);
        this.id = mlogDetail['id'] ? mlogDetail['id'] : null;
        
        this.messageLogDetailType = mlogDetail['messageLogDetailType'] ? 
            (typeof mlogDetail['messageLogDetailType'] === 'number') ?
                new MessageLogDetailType({id : mlogDetail['messageLogDetailType']}) :
                 new MessageLogDetailType(mlogDetail['messageLogDetailType']) : null;
        this.created = mlogDetail['created'] ? new Date(mlogDetail['created']) : null;
        this.created_by =  mlogDetail['created_by'] ? mlogDetail['created_by'] : undefined;
        this.modified =  mlogDetail['modified'] ? new Date(mlogDetail['modified']) : null;
        this.modified_by =  mlogDetail['modified_by'] ? mlogDetail['modified_by'] : undefined;
        this.comment =  mlogDetail['comment'] ? mlogDetail['comment'] : undefined;
    }
}

