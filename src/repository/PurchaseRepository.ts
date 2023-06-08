import { Purchase, User } from "../model/index";
import GenericRepository from "./GenericRepository";
import DatabaseConnection from "../utils/databaseConnection";

export default class PurchaseRepository extends GenericRepository<Purchase>{
    async getAllFromUser(user: User): Promise<Purchase[]>{
        if (!this.connection)
            await this.connect();

        let query:string = `SELECT * FROM ${this.tableName} WHERE userId=${user.id}`;

        let result = await DatabaseConnection.query(query);

        let results: Purchase[] = [];
        for (const item of result){
            results.push(new this.typeConstructor(item));
        }

        return results;
    }
}