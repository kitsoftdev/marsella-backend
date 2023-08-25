import { Audit } from './audit';
import { BuiltIn } from './builtin';
import { Entity } from './entity';

export interface Password extends Entity, BuiltIn, Audit {
    userId: string;
    hash: string;
    salt: string;  
    istemp?:boolean;
}