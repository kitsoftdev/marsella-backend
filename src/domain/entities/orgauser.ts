import { Audit } from './audit';
import { BuiltIn } from './builtin';
import { Entity } from './entity';
import { Role } from './role';

export interface OrgaUser extends Entity, BuiltIn, Audit {
    orgaId: string;
    userId: string;
    roles: Role[];
}