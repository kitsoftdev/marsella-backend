import { OrgaModel } from '../models/orga_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import crypto from 'crypto';

export interface OrgaDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<OrgaModel>>;
    getOne(query: object): Promise<ModelContainer<OrgaModel>>;
    add(orga: OrgaModel) : Promise<ModelContainer<OrgaModel>>;
    update(id: string, orga: object): Promise<ModelContainer<OrgaModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
	getByOrgasIdArray(orgasId: string[]): Promise<ModelContainer<OrgaModel>>;
	getAll(sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<OrgaModel>>;
	getById(orgaId:string): Promise<ModelContainer<OrgaModel>>;
	getByCode(orgaCode:string, discardOrgaId:string): Promise<ModelContainer<OrgaModel>>;
}

export class OrgaDataSourceImpl implements OrgaDataSource {
	collection: MongoWrapper<OrgaModel>;

	constructor(dbMongo: MongoWrapper<OrgaModel>){
		this.collection = dbMongo;
	}
	async getAll(sort?: [string, 1 | -1][] | undefined,
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<OrgaModel>> {
		return await this.collection.getMany<OrgaModel>({}, sort, pageIndex, itemsPerPage);
	}
	async getById(orgaId: string): Promise<ModelContainer<OrgaModel>> {
		return await this.collection.getOne({_id: orgaId});
	}
	async getByCode(orgaCode: string, discardOrgaId: string): Promise<ModelContainer<OrgaModel>> {
		return await this.collection.getOne({code:orgaCode, '_id':{$ne:discardOrgaId}});
	}
	async getByOrgasIdArray(orgasId: string[]): Promise<ModelContainer<OrgaModel>> {
		return await this.collection.getMany<OrgaModel>({'_id': {$in: orgasId}, 'enabled':true});
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<OrgaModel>>{
		return await this.collection.getMany<OrgaModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<OrgaModel>>{
		return await this.collection.getOne(query);
	}
	async add(orga: OrgaModel) : Promise<ModelContainer<OrgaModel>>{
		orga = this.setId(orga);
		return await this.collection.add(orga).then(() => this.getOne({'_id':orga.id}));
	}
	async update(id: string, orga: object): Promise<ModelContainer<OrgaModel>>{
		return await this.collection.update(id, orga).then(() => this.getOne({'_id':id}));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}
	public setId(obj: OrgaModel): OrgaModel
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