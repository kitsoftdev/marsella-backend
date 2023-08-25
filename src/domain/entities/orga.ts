import { Audit } from './audit';
import { BuiltIn } from './builtin';
import { Entity } from './entity';

export interface Orga extends Entity, BuiltIn, Audit {
    name: string;
    code: string;
}