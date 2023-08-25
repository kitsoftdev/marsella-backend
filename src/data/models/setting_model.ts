import { Setting } from '../../domain/entities/setting';

export class SettingModel implements Setting {
	constructor(id:string, code:string, value:string, builtIn:boolean, orgaId?:string){
		this._id = id;
		this.id = id;
		this.code = code;
		this.value = value;
		this.builtIn = builtIn;
		this.orgaId = orgaId;
		this.created = new Date();
	}
	_id: string;
	id:string;
	code: string;
	value: string;
	builtIn: boolean;
	created : Date;
	updated? : Date;
	orgaId?:string;

	public toEntity(): Setting {
		return {id: this.id, code: this.code, value:this.value, created:this.created, updated:this.updated, builtIn:this.builtIn, orgaId:this.orgaId};
	}
}