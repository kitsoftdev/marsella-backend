import { MongoError } from 'mongodb';

export interface Failure {
	name: string;
	message:string;
	code?:string | number;
	kind:string;
}

export class DatabaseFailure implements Failure{
	name: string;
	message:string;
	code?:string | number;
	mongoError?:MongoError;
	kind:string;
	constructor(name: string, message:string, code?:string | number, error?:MongoError)
	{
		this.kind = 'DatabaseFailure';
		this.name = name;
		this.message = message;
		this.code = code;
		this.mongoError = error;
	}
}

export class NetworkFailure implements Failure{
	name: string;
	message:string;
	code?:string | number;
	error?:Error;
	kind:string;
	constructor(name: string, message:string, code?:string | number, error?:Error)
	{
		this.kind = 'NetworkFailure';
		this.name = name;
		this.message = message;
		this.code = code;
		this.error = error;
	}
}

export class GenericFailure implements Failure{
	name: string;
	message:string;
	code?:string | number;
	error?:unknown;
	kind:string;
	constructor(message:string, error?:unknown)
	{
		this.kind = 'GenericFailure';
		this.name = 'generic';
		this.message = message;
		this.code = -1;
		this.error = error;
	}
}