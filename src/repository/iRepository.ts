import * as mariadb from 'mariadb';

export default interface iRepository<T> {
    getAll(conn: mariadb.PoolConnection): Promise<T[]>;
    getById(id: number, conn: mariadb.PoolConnection): Promise<T>;
    add(item: T, conn: mariadb.PoolConnection): Promise<T>;
    update(id: number, item: T, conn: mariadb.PoolConnection): Promise<T>;
    delete(id: number, conn: mariadb.PoolConnection): Promise<boolean>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}