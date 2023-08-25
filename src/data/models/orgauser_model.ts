import crypto from 'crypto';
import { OrgaUser } from '../../domain/entities/orgauser';
import { Role } from '../../domain/entities/role';

export class OrgaUserModel implements OrgaUser {
	constructor(orgaId: string, userId: string, roles: Role[], enabled: boolean, builtIn: boolean){
		this.id = crypto.randomUUID();
		this._id = this.id;
		this.orgaId = orgaId;
		this.userId = userId;
		this.roles = roles;
		this.enabled = enabled;
		this.builtIn = builtIn;
		this.created = new Date();
	}
	_id?: string | undefined;
	id: string;
	orgaId: string;
	userId: string;
	roles: Role[];
	builtIn: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): OrgaUser {
		return {id: this.id, orgaId: this.orgaId, 
			userId: this.userId, roles: this.roles, enabled: this.enabled, builtIn: this.builtIn, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires};
	}

}