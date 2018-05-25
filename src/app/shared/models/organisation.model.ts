export class Organisation {
    public id: number;
    public name: string;
    public logo: string;
    public description: string;
    constructor(org: any) {
        this.id = org['id'] ? org['id'] : undefined;
        this.name = org['name'] ? org['name'] : undefined,
        this.logo = org['logo'] ? org['logo'] : undefined,
        this.description = org['description'] ? org['description'] : undefined;
    }
}

