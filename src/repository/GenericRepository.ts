import DatabaseConnection from '../utils/databaseConnection';

import iRepository from './iRepository';

export default class GenericRepository<T> implements iRepository<T> {
    protected tableName: string;
    protected typeConstructor: new (...args: any[]) => T;
    protected connection: boolean = false;
  
    constructor(typeConstructor: new (...args: any[]) => T) {
        this.typeConstructor = typeConstructor;
        this.tableName = typeConstructor.name;
    }

    async connect(): Promise<void> {
        await DatabaseConnection.connect();
        this.connection = true;
    }
    async disconnect(): Promise<void> {
        await DatabaseConnection.disconnect();
        this.connection = false;
    }

    async getAll(): Promise<T[]> {
        if (!this.connection)
            await this.connect();
            
        let query:string = `SELECT * FROM ${this.tableName};`;

        let result = await DatabaseConnection.query(query);
        
        let results: T[] = [];
        for (const item of result){
            results.push(new this.typeConstructor(item));
        }

        return results;
    }
    
    async getById(id: number): Promise<T> {
        if (!this.connection)
            await this.connect();

        let query:string = `SELECT * FROM ${this.tableName} WHERE id=${id}`;

        let result = await DatabaseConnection.query(query);

        return await new this.typeConstructor(result[0]);
    }
    
    async add(item: any): Promise<T> {
        if (!this.connection)
            await this.connect();

        let values:string = '(';
        for (const value of Object.values(item)){
            if (value == null)
            {
                values += `null,`;
                continue;
            }
            values += `'${value}',`;
        }

        let query:string = `INSERT INTO ${this.tableName} VALUES ${values.substring(0, values.length - 1)+')'};`;
        
        await DatabaseConnection.query(query);
        let result = await DatabaseConnection.query(`SELECT * FROM ${this.tableName} WHERE id=LAST_INSERT_ID();`);

        return await new this.typeConstructor(result[0]);
    }
    
    async update(id: number, item: any): Promise<T> {
        if (!this.connection)
            await this.connect();

        let values:string = '';
        for (const [key, value] of Object.entries(item)){
            if (key != 'id')
                values += `${key}='${value}',`;
        }
        let query: string = `UPDATE ${this.tableName} SET ${values.substring(0, values.length-1)} WHERE id=${id}`;

        await DatabaseConnection.query(query);
        let result = await DatabaseConnection.query(`SELECT * FROM ${this.tableName} WHERE id=${id};`);

        return await new this.typeConstructor(result[0]);
    }
    
    async delete(id: number): Promise<any> {
        if (!this.connection)
            await this.connect();

        let query:string = `DELETE FROM ${this.tableName} WHERE id=${id}`;

        let result = await DatabaseConnection.query(query);

        if (result.affectedRows == 0)
            return false;
        return true;
    }
}