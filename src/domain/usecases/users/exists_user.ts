import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { User } from '../../entities/user';
import { UserRepository } from '../../repositories/user_repository';

export interface ExistsUserUseCase {
    execute(userId:string, username:string, email:string): Promise<Either<Failure,ModelContainer<User>>>;
}

export class ExistsUser implements ExistsUserUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(userId:string, username:string, email:string): Promise<Either<Failure,ModelContainer<User>>> {
		return await this.repository.existsUser(userId, username, email);
	}
}