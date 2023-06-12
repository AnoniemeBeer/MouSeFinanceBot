export default interface iRepository<T> {
    getAll(): Promise<T[]>;
    getById(id: number): Promise<T>;
    add(item: T): Promise<T>;
    update(id: number, item: T): Promise<T>;
    delete(id: number): Promise<boolean>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}