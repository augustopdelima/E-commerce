export interface ProductForm {
    name:string;
    description:string;
    price:string;
    stock:string;
    image: File;
    supplierId?:string;
}

export interface ProductResponse {
    id:number;
    price:number;
    name:string;
    stock:number;
    description:string;
    imageUrl:string;
    supplierId?:number;
}

