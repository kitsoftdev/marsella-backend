import { SettingModel } from '../models/setting_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';
import crypto from 'crypto';

export interface SettingDataSource {
    getMany(query: object): Promise<ModelContainer<SettingModel>>;
    getOne(query: object): Promise<ModelContainer<SettingModel>>;
    add(setting: SettingModel) : Promise<ModelContainer<SettingModel>>;
    update(id: string, setting: object): Promise<ModelContainer<SettingModel>>;
	getAllByOrga(orgaId: string): Promise<ModelContainer<SettingModel>>;
	getAllSuper(): Promise<ModelContainer<SettingModel>>;
	getById(settingId:string): Promise<ModelContainer<SettingModel>>;
	getByCode(code:string): Promise<ModelContainer<SettingModel>>;
	updateDirectByQuery(query: object, obj: object): Promise<boolean>;	
}

export class SettingDataSourceImpl implements SettingDataSource {
	collection: MongoWrapper<SettingModel>;

	constructor(dbMongo: MongoWrapper<SettingModel>){
		this.collection = dbMongo;
	}
	async updateDirectByQuery(query: object, obj: object): Promise<boolean> {
		return await this.collection.updateDirectByQuery(query, obj);
	}
	async getAllByOrga(orgaId: string): Promise<ModelContainer<SettingModel>> {
		return await this.collection.getMany({orgaId:orgaId});
	}
	async getAllSuper(): Promise<ModelContainer<SettingModel>> {
		return await this.collection.getMany({orgaId:undefined});
	}
	async getByCode(code: string): Promise<ModelContainer<SettingModel>> {
		return await this.collection.getMany({code:code});
	}
	async getById(settingId: string): Promise<ModelContainer<SettingModel>> {
		return await this.collection.getOne({_id: settingId});
	}
	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<SettingModel>>{
		return await this.collection.getMany<SettingModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<SettingModel>>{
		return await this.collection.getOne(query);
	}
	async add(setting: SettingModel) : Promise<ModelContainer<SettingModel>>{
		setting = this.setId(setting);
		return await this.collection.add(setting).then(() => this.getOne({'_id':setting.id}));
	}
	async update(id: string, setting: object): Promise<ModelContainer<SettingModel>>{
		return await this.collection.update(id, setting).then(() => this.getOne({'_id':id}));
	}
	public setId(obj: SettingModel): SettingModel
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