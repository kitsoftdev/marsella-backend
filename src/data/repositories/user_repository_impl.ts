import { MongoError } from 'mongodb';
import { UserRepository } from '../../domain/repositories/user_repository';
import { UserDataSource } from '../datasources/user_data_source';
import { UserModel } from '../models/user_model';
import { ModelContainer } from '../../core/model_container';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { Either } from '../../core/either';
import { User } from '../../domain/entities/user';

export class UserRepositoryImpl implements UserRepository {
	dataSource: UserDataSource;
	constructor(dataSource: UserDataSource){
		this.dataSource = dataSource;
	}

	async getUsersByOrgaId(searchText: string, orgaId: string, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure,ModelContainer<User>>> {
		try
		{
			if(!sort || sort.length < 1)
				sort = [['email', 1]];

			const result = await this.dataSource
				.getByOrgaId(searchText, orgaId, sort, pageIndex, itemsPerPage);
			
			return Either.right(result);		
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}

	async getUsersNotInOrga(searchText: string, orgaId: string, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<User>>>{
		try
		{
			if(!sort)
				sort = [['email', 1]];

			const result = await this.dataSource
				.getWhoAreNotInOrga(searchText, orgaId, sort, pageIndex, itemsPerPage);
			
			return Either.right(result);		
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}

	async getUser(id: string): Promise<Either<Failure,ModelContainer<User>>> {
		try
		{
			const result = await this.dataSource.getById(id);
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
		}
	}
	async addUser(id: string, name: string, username: string, email: string,
		enabled: boolean, builtIn: boolean) : Promise<Either<Failure,ModelContainer<User>>> {
		try{
			const user: UserModel = new UserModel(id, name, username, email, enabled, builtIn);
			const result = await this.dataSource.add(user);
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
		}
	}

	async updateUser(id: string, user: object) : Promise<Either<Failure,ModelContainer<User>>>{
		try{
			const result = await this.dataSource.update(id, user);
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
		}
	}

	async enableUser(id: string, enableOrDisable: boolean): Promise<Either<Failure,boolean>>{
		try{
			const result = await this.dataSource.enable(id, enableOrDisable);
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
		}
	}
	async deleteUser(id: string): Promise<Either<Failure,boolean>>{
		try{
			const result = await this.dataSource.delete(id);
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
		}
	}
	async existsUser(userId: string, username: string, email: string): Promise<Either<Failure,ModelContainer<User>>> {
		try
		{
			
			const result = await this.dataSource.getIfExistsByUsernameEmail(username, email, userId);
			
			return Either.right(result);
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));
		}
	}
}