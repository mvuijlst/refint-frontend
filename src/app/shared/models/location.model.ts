import { Address } from './address.model';
export class Location {
    public id: number;
    public name: string;
    public description: string;
    public addresses: Address[] = [];
    constructor(loc: any) {
        this.id = loc['id'];
        this.name = loc['name'];
        this.description = loc['description'];
        if (loc["locationaddresses"]) {
            loc["locationaddresses"].forEach(add => {
                this.addresses.push(new Address(add));
                
            });
        }
    }
}
