import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ClothingItem {
    id: string;
    imageBlob: ExternalBlob;
    name: string;
    description: string;
    price?: string;
}
export interface backendInterface {
    addClothingItem(id: string, name: string, description: string, price: string | null, imageBlob: ExternalBlob): Promise<void>;
    deleteClothingItem(id: string): Promise<void>;
    getAllClothingItems(): Promise<Array<ClothingItem>>;
    getClothingItem(id: string): Promise<ClothingItem>;
    updateClothingItem(id: string, name: string, description: string, price: string | null, imageBlob: ExternalBlob): Promise<void>;
}
