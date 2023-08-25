import { Orga } from '../../domain/entities/orga';

export class OrgaModel implements Orga {
	constructor(id: string, name: string, code: string, enabled: boolean, builtIn: boolean){
		this.id = id;
		this._id = id;
		this.name = name;
		this.code = code;
		this.enabled = enabled;
		this.builtIn = builtIn;
		this.created = new Date();
	}

	_id: string;
	id: string;
	name: string;
	code: string;
	builtIn: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;

	public toEntity(): Orga {
		return {id: this.id, name: this.name, 
			code: this.code, enabled: this.enabled, builtIn: this.builtIn, created: this.created, updated: this.updated, deleted: this.deleted, expires: this.expires};
	}

}