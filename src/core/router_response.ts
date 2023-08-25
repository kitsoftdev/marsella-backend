import { isBooleanObject } from 'util/types';
import { DatabaseFailure, GenericFailure, NetworkFailure } from './errors/failures';
import { ModelContainer } from './model_container';
import crypto from 'crypto';

export class RouterResponse{
	apiVersion?: string;
	context?: string;
	id?: string;
	_id?: string;
	method?: string;
	params?: object;
	data?:DataResponse;
	error?:ErrorResponse;
	constructor(apiVersion:string, response:object | string | boolean | null, method?:string, params?:object, context?:string){
		this.apiVersion = apiVersion;
		this.method = method;
		this.params = params;
		this.context = context;
		this.id = crypto.randomUUID();
		this._id = this.id;
		setDataError(response, this);
	}

	public static emptyResponse(): RouterResponse {
		return new RouterResponse('1.0', null);
	}
}



function setDataError(response: object | string | boolean | null, routerResponse:RouterResponse) {
	//DatabaseFailure
	if (response instanceof DatabaseFailure) {
		routerResponse.data = undefined;
		routerResponse.error = new ErrorResponse(response.code, response.message);
		if (response.mongoError != null) {
			//mongoerror
			routerResponse.error.addErrorItem({
				domain: response.mongoError.code,
				reason: response.mongoError.cause?.message,
				message: response.mongoError.message,
				location: response.mongoError.stack,
				extendedHelp: response.mongoError.errmsg
			});
			//con causa (otro error)
			if (response.mongoError.cause != null) {
				routerResponse.error.addErrorItem({
					domain: response.mongoError.cause.name,
					reason: response.mongoError.cause.message,
					location: response.mongoError.cause.stack
				});
			}
		}
		//NetworkFailure
	} else if (response instanceof NetworkFailure) {
		routerResponse.data = undefined;
		routerResponse.error = new ErrorResponse(response.code, response.message);
		if (response.error != null) {
			//con error cargado
			routerResponse.error.addErrorItem({
				domain: response.code,
				message: response.message,
				location: response.error.stack,
			});
		}
		//GenericFailure
	} else if (response instanceof GenericFailure) {
		routerResponse.data = undefined;
		routerResponse.error = new ErrorResponse(response.code, response.message);
		if (response.error != null) {
			//con error cargado
			routerResponse.error.addErrorItem({
				domain: response.code,
				message: response.message,
			});
		}
		//Error
	}else if (response instanceof Error) {
		routerResponse.data = undefined;
		routerResponse.error = new ErrorResponse(response.name, response.message);
		//null
	} else if (response == null)
	{
		routerResponse.data = undefined;
		routerResponse.error = new ErrorResponse(501, 'empty');		
		//string
	} else if (typeof response === 'string') {
		routerResponse.data = undefined;
		routerResponse.error = new ErrorResponse(406, response);
	} else {
		//Datas
		routerResponse.error = undefined;
		//ModelContainer
		if (response instanceof ModelContainer) {
			routerResponse.data = {
				items: response.items,
				kind: typeof (response.items).toString(),
				currentItemCount: response.currentItemCount,
				itemsPerPage: response.itemsPerPage,
				startIndex: response.startIndex,
				totalItems: response.totalItems,
				pageIndex: response.pageIndex,
				totalPages: response.totalPages,
				updated: new Date(),
			};
		} 
		//cualquier objecto menos bool
		else if(response instanceof Object)
		{
			routerResponse.data = {
				items: [response as object],
				kind: typeof response,
				currentItemCount: 1,
				updated: new Date()
			};
		} else if(isBooleanObject(new Boolean(response)))
		{
			routerResponse.data = {
				items: [new Boolean(response)],
				kind: 'boolean',
				currentItemCount: 1,
				updated: new Date(),				
			};
		}
		
	}
}

export class ErrorResponse{
	code?:string | number;
	message?:string;
	errors?:ErrorItem[];
    
	constructor(code?:string | number, message?:string, error?:ErrorItem)
	{
		this.code = code;
		this.message = message;
		if(error != null)
			this.errors = [error];
	}
    
	public addErrorItem(error:ErrorItem)
	{
		if(this.errors == null) this.errors = [];
		this.errors.push(error);
	}

}

export class ErrorItem{
	domain?:string | number; 
	reason?:string; 
	message?:string; 
	location?:string; 
	locationType?:string; 
	extendedHelp?:string; 
	sendReport?:string;}

export class DataResponse{
	kind?:string;
	fields?:string;
	etag?:string;
	id?:string;
	lang?:string;
	updated?:Date;
	deleted?:Date;
	currentItemCount?:number;
	itemsPerPage?:number;
	startIndex?:number;
	totalItems?:number;
	pageIndex?:number;
	totalPages?:number;
	pageLinkTemplate?:string;
	next?:object;
	nextLink?:string;
	previous?:object;
	previousLink?:string;
	self?:object;
	selfLink?:string;
	edit?:object;
	editLink?:string;
	items?: object[];
}
