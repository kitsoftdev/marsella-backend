import { PasswordModel } from '../models/password_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import crypto from 'crypto';

export interface PasswordDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PasswordModel>>;
    getOne(query: object): Promise<ModelContainer<PasswordModel>>;
    add(password: PasswordModel) : Promise<ModelContainer<PasswordModel>>;
    update(passwordId: string, password: object): Promise<ModelContainer<PasswordModel>>;
	updateByUserId(userId: string, changes: object): Promise<ModelContainer<PasswordModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
	getByUserId(userId:string): Promise<ModelContainer<PasswordModel>>;
}

export class PasswordDataSourceImpl implements PasswordDataSource {
	collection: MongoWrapper<PasswordModel>;

	constructor(dbMongo: MongoWrapper<PasswordModel>){
		this.collection = dbMongo;
	}

	async getByUserId(userId: string): Promise<ModelContainer<PasswordModel>> {
		return await this.collection.getOne({'userId':userId, 'enabled':true});
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<PasswordModel>>{
		return await this.collection.getMany<PasswordModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<PasswordModel>>{
		return await this.collection.getOne(query);
	}
	async add(password: PasswordModel) : Promise<ModelContainer<PasswordModel>>{
		password = this.setId(password);
		return await this.collection.add(password).then(() => this.getOne({'_id':password.id}));
	}
	async update(passwordId: string, password: object): Promise<ModelContainer<PasswordModel>>{
		return await this.collection.update(passwordId, password).then(() => 
			this.getOne({_id:passwordId})
		);
	}
	async updateByUserId(userId: string, changes: object): Promise<ModelContainer<PasswordModel>> {
		const params = (changes as {[x: string]: unknown;});
		if(changes != null)
			params['updated'] = new Date();

		return await this.collection.updateDirectByQuery({'userId': userId}, {$set:params}).then(() => this.getOne({'userId':userId}));
		
	}	
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}
	public setId(obj: PasswordModel): PasswordModel
	{
		if(obj.id == '')
		{
			obj.id = crypto.randomUUID();
			obj._id = obj.id;
		}
		else
			obj._id = obj.id;
		return obj;
	}
}