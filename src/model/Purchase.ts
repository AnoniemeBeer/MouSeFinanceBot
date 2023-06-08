export class Purchase{
    id: number;
    description: string;
    price: number;
    userId: number;

    constructor(object: any){
        this.id = object.id;
        this.description = object.description;
        this.price = object.price;
        this.userId = object.userId;
    }
}