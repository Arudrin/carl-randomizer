declare module "indexdb" {
    export function openDB(): Promise<IDBDatabase>;
    export function addItem(item: { name: string }): Promise<void>;
    export function getAllItems(): Promise<{ id?: number; name: string }[]>;
}