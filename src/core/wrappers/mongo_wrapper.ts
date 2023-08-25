import { Db, Document, ObjectId } from 'mongodb';
import { ModelContainer } from '../model_container';

export interface NoSQLDatabaseWrapper<T>{
    getMany(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<T>>;
	getManyWithOptions(query: object, options?: object | undefined, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<T>>;		
    getOne(query: object): Promise<ModelContainer<T>>;
    getOneWithOptions(query: object, options: object | undefined): Promise<ModelContainer<T>>;	
    add(obj: T) : Promise<boolean>;
    update(id: string, obj: object): Promise<boolean>;
    enable(id: string, enableOrDisable: boolean): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    updateDirect(id: string, obj: object): Promise<boolean>;	
	updateArray(id: string, obj: object, arrayFilters:object): Promise<boolean>;
	updateDirectByQuery(query: object, obj: object): Promise<boolean>;	
	upsert(query: object, obj: object): Promise<boolean>;
	collectionName:string;
	db:Db;
}

export class MongoWrapper<T> implements NoSQLDatabaseWrapper<T>{
	collectionName:string;
	db:Db;
	constructor(collectionName: string, dbMongo: Db){
		this.collectionName = collectionName;
		this.db = dbMongo;
	}
	
	async upsert(query: object, obj: object): Promise<boolean> {
		const options = { upsert: true };
		const result = await this.db.collection<Document>(this.collectionName).updateOne(query, obj, options);
		return (result?.upsertedCount > 0 ? true : false);
	}
    
	private async runQuery(pageIndex: number | undefined, totalItems: number | undefined, query: object, options: object | undefined,
		sort: [string, 1 | -1][] | undefined, result: unknown, itemsPerPage: number | undefined, startIndex: number, totalPages: number) {
		totalItems = await this.setTotalItems(pageIndex, totalItems, query);
		

		if (sort == undefined && pageIndex == undefined)
			result = await this.runSimpleQuery(result, query, options);
		if (sort != undefined && pageIndex == undefined)
			result = await this.runSorterQuery(result, query, options, sort);
		if (sort != undefined && pageIndex != undefined) {

			const limit: number = (itemsPerPage == undefined ? 10 : itemsPerPage);
			const skip: number = (pageIndex - 1) * limit;
			result = await this.runFullQuery(result, query, options, sort, skip, limit);

			startIndex = ((pageIndex - 1) * limit) + 1;
			totalPages = parseInt(Math.ceil((totalItems == undefined ? 1 : totalItems) / limit).toString());

		}
		return { totalItems, result, startIndex, totalPages };
	}

	private async runFullQuery(result: unknown, query: object, options: object | undefined, sort: [string, 1 | -1][], skip: number, limit: number) {

		result = await this.db.collection<Document>(this.collectionName).aggregate([{$match:query}, {$sort:this.transformArrayToObject(sort)}, {$skip:skip}, {$limit:limit}], options).toArray();

		//result = await this.db.collection<Document>(this.collectionName)
		//	.find(query, options).sort(sort).skip(skip).limit(limit).toArray();

		return result;
	}

	private async runSorterQuery(result: unknown, query: object, options: object | undefined, sort: [string, 1 | -1][]) {
		result = await this.db.collection<Document>(this.collectionName)
			.find(query, options).sort(sort).toArray();

		return result;
	}

	private async runSimpleQuery(result: unknown, query: object, options: object | undefined) {
		result = await this.db.collection<Document>(this.collectionName)
			.find(query, options).toArray();

		return result;
	}

	public async setTotalItems(pageIndex: number | undefined, totalItems: number | undefined, query: object) {
		if (pageIndex != null) {
			totalItems = (await this.db.collection<Document>(this.collectionName).count(query));
		}
		return totalItems;
	}
	public createModelContainer<T>(result: unknown, itemsPerPage: number | undefined, pageIndex: number | undefined, startIndex: number, totalItems: number | undefined, totalPages: number) {
		const contains_many = new ModelContainer<T>(result as T[]);
		contains_many.itemsPerPage = itemsPerPage;
		contains_many.pageIndex = pageIndex;
		contains_many.startIndex = (startIndex == 1 ? undefined : startIndex);
		contains_many.totalItems = totalItems;
		contains_many.totalPages = (totalPages == 0 ? undefined : totalPages);
		return contains_many;
	}
	async getMany<T>(query: object, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<T>>{
		let result = null;
		let startIndex = 1;
		let totalPages = 0;  
		let totalItems:number | undefined = undefined;

		({ totalItems, result, startIndex, totalPages } = 
			await this.runQuery(pageIndex, totalItems, query, undefined, 
				sort, result, itemsPerPage, startIndex, totalPages));
	
		if(result == null || result == undefined){
			throw new Error('null value');
		}

		const contains_many = this.createModelContainer<T>(result, itemsPerPage, pageIndex, startIndex, totalItems, totalPages);

		return contains_many;
	}

	async getManyWithOptions<T>(query: object, options?: object | undefined, sort?: [string, 1 | -1][],
		pageIndex?: number, itemsPerPage?: number): Promise<ModelContainer<T>>{
		let result = null;
		let startIndex = 1;
		let totalPages = 0;  
		let totalItems:number | undefined = undefined;

		({ totalItems, result, startIndex, totalPages } = 
			await this.runQuery(pageIndex, totalItems, query, options, 
				sort, result, itemsPerPage, startIndex, totalPages));
	
		if(result == null || result == undefined){
			throw new Error('null value');
		}

		const contains_many = this.createModelContainer<T>(result, itemsPerPage, pageIndex, startIndex, totalItems, totalPages);

		return contains_many;
	}

	async getOne<T>(query: object): Promise<ModelContainer<T>>{
		const result = await this.db.collection<Document>(this.collectionName).findOne(query);
		if(result == null || result == undefined){
			return new ModelContainer([]);
		}
		return ModelContainer.fromOneItem(result as T);
	}

	async getOneWithOptions<T>(query: object, options: object | undefined): Promise<ModelContainer<T>>{
		const result = await this.db.collection<Document>(this.collectionName).findOne(query, options);
		if(result == null || result == undefined){
			return new ModelContainer([]);
		}
		return ModelContainer.fromOneItem(result as T);
	}

	async add<T>(obj: T) : Promise<boolean>{
		const result = await this.db.collection<Document>(this.collectionName).insertOne(obj as Document);
		return (result?.insertedId ? true: false);
	}

	async update(id: string, obj: object): Promise<boolean>{
		const params = (obj as {[x: string]: unknown;});
		if(obj != null)
			params['updated'] = new Date();

		const result = await this.db.collection<Document>(this.collectionName).updateOne({_id: id}, {$set:params},);
		return (result?.modifiedCount > 0 ? true : false);
	}
	async updateArray(id: string, obj: object, arrayFilters:object): Promise<boolean>{
		const result = await this.db.collection<Document>(this.collectionName).updateOne({_id: id}, obj, arrayFilters);
		return (result?.modifiedCount > 0 ? true : false);
	}	
	async updateDirect(id: string, obj: object): Promise<boolean>{
		const result = await this.db.collection<Document>(this.collectionName).updateOne({_id: id}, obj);
		return (result?.modifiedCount > 0 ? true : false);

	}	
	async updateDirectByQuery(query: object, obj: object): Promise<boolean>{
		const result = await this.db.collection<Document>(this.collectionName).updateOne(query, obj);
		return (result?.modifiedCount > 0 ? true : false);

	}		
	async enable(id: string, enableOrDisable: boolean): Promise<boolean>{
		const result = await this.db.collection<Document>(this.collectionName)
			.updateOne({_id: id, builtIn:false}, {$set: {enabled: enableOrDisable, updated: new Date()}});
		return (result?.modifiedCount > 0);
	}
	async delete(id: string): Promise<boolean>{
		const ri = await this.db.collection<Document>(this.collectionName).findOne({'_id': id, builtIn:false}); 
		if(!ri)
			return false;

		const rn = await this.update(id, {'deleted': new Date()});
		if(rn){
			const i = await this.db.collection<Document>(this.collectionName).findOne({'_id': id, builtIn:false});
			if(i != null)
			{
				i._id = new ObjectId();
				await this.db.collection<Document>(this.collectionName + '_deleted').insertOne(i as Document);
				const result = await this.db.collection<Document>(this.collectionName).deleteOne({_id: id, builtIn:false});
				return (result.deletedCount > 0);
			}
		}
		return false;
	}    

	transformArrayToObject(array: [string, 1 | -1][] | undefined): { [x: string]: 1 | -1; } {
		const result: { [x: string]: 1 | -1; } = {};
		if(array == undefined)
		{
			return result;
		}
		
		for (const [key, value] of array) {
			result[key] = value;
		}
		
		return result;
	}

}