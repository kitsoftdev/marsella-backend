import { Role } from '../../domain/entities/role';

export class RoleModel implements Role {
	constructor(name: string, enabled: boolean){
		this._id = name;
		this.id = name;
		this.name = name;
		this.enabled = enabled;
	}
	_id: string;
	id:string;
	name: string;
	enabled: boolean;

	public toEntity(): Role {
		return {id: this.id, name:this.name, enabled:this.enabled};
	}
}