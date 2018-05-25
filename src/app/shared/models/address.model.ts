export class Address {
    public address: string;
    public postalcode: string;
    public city: string;
    public valid: boolean;
    public remarks: string;
    public datefrom: Date;
    public dateuntil: Date;
    constructor(address: any) {
        this.address = address['address'] ? address['address'] : '';
        this.postalcode = address['postalcode'] ? address['postalcode'] : '';
        this.city = address['city'] ? address['city'] : '';
        this.valid = address['valid'] ? address['valid'] : '';
        this.remarks = address['remarks'] ? address['remarks'] : '';
        this.datefrom = address['datefrom'] ? address['datefrom'] : '';
        this.dateuntil = address['dateuntil'] ? address['dateuntil'] : '';
    }
}
