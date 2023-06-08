import { User } from "../model/index";
import GenericRepository from "./GenericRepository";
import DatabaseConnection from "../utils/databaseConnection";

export default class UserRepository extends GenericRepository<User>{
    async getByDiscordId(discordId: string): Promise<User> {
        if (!this.connection)
            await this.connect();

        let query:string = `SELECT * FROM ${this.tableName} WHERE discordId=${discordId}`;

        let result = await DatabaseConnection.query(query);

        return new this.typeConstructor(result[0]);
    }
}