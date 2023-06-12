import iRepository from './iRepository';

export default class GenericRepository<T> implements iRepository<T> {
    protected tableName: string;
    protected typeConstructor: new (...args: any[]) => T;
    protected connection: boolean = false;
  
    constructor(typeConstructor: new (...args: any[]) => T) {
        this.typeConstructor = typeConstructor;
        this.tableName = typeConstructor.name;
    }
    getAll(): Promise<T[]> {
        throw new Error('Method not implemented.');
    }
    getById(id: number): Promise<T> {
        throw new Error('Method not implemented.');
    }
    add(item: T): Promise<T> {
        throw new Error('Method not implemented.');
    }
    update(id: number, item: T): Promise<T> {
        throw new Error('Method not implemented.');
    }
    delete(id: number): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    connect(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    disconnect(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}