class User{
    _id: number;
    _name: string;
    _discordId: string;

    constructor(id: number, name: string, discordId: string){
        this._id = id;
        this._name = name;
        this._discordId = discordId;
    }

    public get id(){
        return this._id;
    }

    public set id(id: number){
        this._id = id;
    }

    public get name(){
        return this._name;
    }

    public set name(name: string){
        this._name = name;
    }

    public get discordId(){
        return this._discordId;
    }

    public set discordId(discordId: string){
        this._discordId = discordId;
    }
}