export default interface iRepository<T> {
    getAll(): Promise<T[]>;
    getById(id: number): Promise<T | null>;
    add(item: T): Promise<T|null>;
    update(id: number, item: T): Promise<T | null>;
    delete(id: number): Promise<boolean>;
}