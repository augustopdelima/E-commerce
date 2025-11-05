export  interface Address {
    street:string;
    number:string;
    city: string;
    state:string;
    zipcode: string;
}

export interface AddressResponse extends Address {
    id:number;
}