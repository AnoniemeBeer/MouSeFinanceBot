export class User{
    id: number|null;
    name: string;
    discordId: string;

    constructor(object: any){
        this.id = object.id;
        this.name = object.name;
        this.discordId = object.discordId;
    }
}