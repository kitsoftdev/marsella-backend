import { ModelContainer } from '../../core/model_container';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { OrgaUserModel } from '../models/orgauser_model';
import crypto from 'crypto';

export interface OrgaUserDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<OrgaUserModel>>;
    getOne(query: object): Promise<ModelContainer<OrgaUserModel>>;
    add(orgaOrgaUser: OrgaUserModel) : Promise<ModelContainer<OrgaUserModel>>;
    update(id: string, orgaOrgaUser: object): Promise<ModelContainer<OrgaUserModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;

	getByOrgaId(orgaId:string): Promise<ModelContainer<OrgaUserModel>>;
	getByUserId(userId:string): Promise<ModelContainer<OrgaUserModel>>;
	getOneBy(orgaId: string, userId: string): Promise<ModelContainer<OrgaUserModel>>;
}

export class OrgaUserDataSourceImpl implements OrgaUserDataSource {
	collection: MongoWrapper<OrgaUserModel>;

	constructor(dbMongo: MongoWrapper<OrgaUserModel>){
		this.collection = dbMongo;
	}
	async getByOrgaId(orgaId: string): Promise<ModelContainer<OrgaUserModel>> {
		return await this.collection.getMany<OrgaUserModel>({'orgaId': orgaId});
	}
	async getByUserId(userId: string): Promise<ModelContainer<OrgaUserModel>> {
		return await this.collection.getMany<OrgaUserModel>({'userId': userId});
	}
	async getOneBy(orgaId: string, userId: string): Promise<ModelContainer<OrgaUserModel>> {
		return await this.collection.getOne({'orgaId': orgaId, 'userId': userId, 'enabled':true});
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<OrgaUserModel>>{
		return await this.collection.getMany<OrgaUserModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<OrgaUserModel>>{
		return await this.collection.getOne(query);
	}
	async add(orgaOrgaUser: OrgaUserModel) : Promise<ModelContainer<OrgaUserModel>>{
		orgaOrgaUser = this.setId(orgaOrgaUser);
		return await this.collection.add(orgaOrgaUser).then(() => this.getOne({'_id':orgaOrgaUser.id}));
	}
	async update(id: string, orgaOrgaUser: object): Promise<ModelContainer<OrgaUserModel>>{
		return await this.collection.update(id, orgaOrgaUser).then(() => this.getOne({'_id':id}));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}
	public setId(obj: OrgaUserModel): OrgaUserModel
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