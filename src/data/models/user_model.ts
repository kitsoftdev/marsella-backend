import { User } from '../../domain/entities/user';

export class UserModel implements User {
	constructor(id: string, name: string, username: string, 
		email: string, enabled: boolean, builtIn: boolean){
		this.id = id;
		this._id = id;
		this.name = name;
		this.username = username;
		this.email = email;
		this.enabled = enabled;
		this.builtIn = builtIn;
		this.created = new Date();
	}
	_id: string;
	id: string;
	name: string;
	username: string;
	email: string;
	builtIn: boolean;
	enabled: boolean;
	created: Date;
	updated?: Date;
	deleted?: Date;
	expires?: Date;
	orgas?: ({id:string, code:string}[]);
	pictureUrl?: string;
	pictureCloudFileId?: string;
	pictureThumbnailUrl?: string;
	pictureThumbnailCloudFileId?: string;	

	public toEntity(): User {
		return {id: this.id, name: this.name, 
			username: this.username, email: this.email, enabled: this.enabled, builtIn: this.builtIn, created: this.created, orgas: this.orgas, updated: this.updated, deleted: this.deleted, expires: this.expires, pictureUrl: this.pictureUrl, pictureCloudFileId: this.pictureCloudFileId, pictureThumbnailUrl: this.pictureThumbnailUrl, pictureThumbnailCloudFileId: this.pictureThumbnailCloudFileId};
	}
}