export class LanguageProficiency{
    public language: string;
    public proficiency: Proficiency;
    constructor (lang: any) {
        // console.log(lang);
        this.language = lang['language']['name'];
        this.proficiency = Proficiency['p' + lang['proficiency']];
    }
}

export enum Proficiency {
    p1 = 'Paar woorden',
    p2 = 'Basis',
    p3 = 'Goed',
    p4 = 'Vloeiend',
    pM = 'Moedertaal',
}