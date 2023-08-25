import { BuiltIn } from './builtin';

export interface Setting extends BuiltIn {
    _id?: string;
    id: string;
    code: string;
    value: string;
    orgaId?:string;
    created: Date;
    updated?: Date;    
}