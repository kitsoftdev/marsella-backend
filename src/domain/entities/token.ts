import { Orga } from './orga';

export interface Token {
    value:string;
    istemp?:boolean;
	orgaId?:string;
	orgas?:Orga[];    
}