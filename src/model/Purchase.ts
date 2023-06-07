class Purchase{
    _id: number;
    _description: string;
    _price: number;
    _userId: number;

    constructor(id: number, description: string, price: number, userId: number){
        this._id = id;
        this._description = description;
        this._price = price;
        this._userId = userId;
    }

    public get id(){
        return this._id;
    }

    public set id(id: number){
        this._id = id;
    }

    public get description(){
        return this._description;
    }

    public set description(description: string){
        this._description = description;
    }

    public get price(){
        return this._price;
    }

    public set price(price: number){
        this._price = price;
    }

    public get userId(){
        return this._userId;
    }

    public set userId(userId: number){
        this._userId = userId;
    }
}