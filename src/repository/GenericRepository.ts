import DatabaseConnection from '../utils/databaseConnection';

import iRepository from './iRepository';

export default class GenericRepository<T> implements iRepository<T> {
    private tableName: string;
    private typeConstructor: new (...args: any[]) => T;
  
    constructor(typeConstructor: new (...args: any[]) => T) {
        this.typeConstructor = typeConstructor;
        this.tableName = typeConstructor.name;
    }
    
    async getAll(): Promise<T[]> {
        let query:string = `SELECT * FROM User;`;

        await DatabaseConnection.connect();
        let result = await DatabaseConnection.query("SELECT * FROM User;");
        await DatabaseConnection.disconnect();
         
        return result;
    }
    
    async getById(id: number): Promise<T | null> {
        // Implementation of retrieving an entity by ID from the database
        return Promise.resolve(null);
    }
    
    async add(item: T): Promise<T | null> {
        // Implementation of creating a new entity in the database
        return Promise.resolve(null);
    }
    
    async update(id: number, item: T): Promise<T | null> {
        // Implementation of updating an entity in the database
        return Promise.resolve(null);
    }
    
    async delete(id: number): Promise<boolean> {;
        // Implementation of deleting an entity from the database

        return Promise.resolve(false);
    }
}