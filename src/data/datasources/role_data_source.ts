import { RoleModel } from '../models/role_model';
import { MongoWrapper } from '../../core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../core/model_container';


export interface RoleDataSource {
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<RoleModel>>;
    getOne(query: object): Promise<ModelContainer<RoleModel>>;
    add(role: RoleModel) : Promise<ModelContainer<RoleModel>>;
    update(id: string, role: object): Promise<ModelContainer<RoleModel>>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;

    getByName(name:string): Promise<ModelContainer<RoleModel>>;
	getAll(): Promise<ModelContainer<RoleModel>>;
}

export class RoleDataSourceImpl implements RoleDataSource {
	collection: MongoWrapper<RoleModel>;

	constructor(dbMongo: MongoWrapper<RoleModel>){
		this.collection = dbMongo;
	}
	async getByName(name: string): Promise<ModelContainer<RoleModel>> {
		return await this.collection.getOne({'_id':name});
	}
	async getAll(): Promise<ModelContainer<RoleModel>> {
		return await this.collection.getMany<RoleModel>({});
	}

	async getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<RoleModel>>{
		return await this.collection.getMany<RoleModel>(query, sort, pageIndex, itemsPerPage);
	}
	async getOne(query: object): Promise<ModelContainer<RoleModel>>{
		return await this.collection.getOne(query);
	}
	async add(role: RoleModel) : Promise<ModelContainer<RoleModel>>{
		role = this.setId(role);
		return await this.collection.add(role).then(() => this.getOne({'_id':role.id}));	
	}
	async update(id: string, role: object): Promise<ModelContainer<RoleModel>>{
		return await this.collection.update(id, role).then(() => this.getOne({'_id':id}));
	}
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		return await this.collection.enable(id, enableOrDisable);
	}
	async delete(id: string): Promise<boolean>{
		return await this.collection.delete(id);
	}
	public setId(obj: RoleModel): RoleModel
	{
		if(obj.id == '')
		{
			obj.id = obj.name;
			obj._id = obj.id;
		}
		else
			obj._id = obj.id;
		return obj;
	}
}