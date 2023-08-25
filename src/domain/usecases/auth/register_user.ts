import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Auth } from '../../entities/auth';
import { User } from '../../entities/user';
import { AuthRepository } from '../../repositories/auth_repository';

export interface RegisterUserUseCase {
    execute(user:User, auth:Auth): Promise<Either<Failure,ModelContainer<User>>>;
}

export class RegisterUser implements RegisterUserUseCase {
	repository: AuthRepository;
	constructor(repository: AuthRepository) {
		this.repository = repository;
	}

	async execute(user:User, auth:Auth): Promise<Either<Failure,ModelContainer<User>>> {
		return await this.repository.registerUser(user, auth);
	}
}