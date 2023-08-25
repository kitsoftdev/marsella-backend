import { Either } from '../../../../src/core/either';
import { Failure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { UserModel } from '../../../../src/data/models/user_model';
import { UserRepository } from '../../../../src/domain/repositories/user_repository';

export class MockUserRepository implements UserRepository {

	getUsersByOrgaId(): Promise<Either<Failure, ModelContainer<UserModel>>> {
		throw new Error('Method not implemented.');
	}
	getUser(): Promise<Either<Failure, ModelContainer<UserModel>>> {
		throw new Error('Method not implemented.');
	}
	addUser() : Promise<Either<Failure, ModelContainer<UserModel>>> {
		throw new Error('Method not implemented.');
	}
	updateUser() : Promise<Either<Failure, ModelContainer<UserModel>>> {
		throw new Error('Method not implemented.');
	}
	enableUser(): Promise<Either<Failure, boolean>> {
		throw new Error('Method not implemented.');
	}
	deleteUser(): Promise<Either<Failure,boolean>> {
		throw new Error('Method not implemented.');
	}

	getUsersNotInOrga(): Promise<Either<Failure, ModelContainer<UserModel>>>{
		throw new Error('Method not implemented.');
	}

	existsUser(): Promise<Either<Failure, ModelContainer<UserModel>>>{
		throw new Error('Method not implemented.');
	}

}