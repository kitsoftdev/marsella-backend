import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { UserModel } from '../../../data/models/user_model';
import { User } from '../../entities/user';
import { UserRepository } from '../../repositories/user_repository';

export interface AddUserUseCase {
    execute(user: UserModel): Promise<Either<Failure, ModelContainer<User>>>;
}

export class AddUser implements AddUserUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(user: UserModel): Promise<Either<Failure,ModelContainer<User>>> {
		return await this.repository.addUser(user.id, user.name, 
			user.username, user.email, user.enabled, 
			user.builtIn);
	}
}