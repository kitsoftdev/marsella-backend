import { Token } from '../../domain/entities/token';
import { OrgaModel } from './orga_model';

export class TokenModel implements Token {
	constructor(value:string, orgaId?:string, orgas?:OrgaModel[], istemp?:boolean){
		this.value = value;
		this.orgas = orgas;
		this.istemp = istemp;
		this.orgaId = orgaId;
	}
	value:string;
	istemp?:boolean;
	orgaId?:string;
	orgas?:OrgaModel[];

	public toEntity(): Token {
		return {value:this.value};
	}
}