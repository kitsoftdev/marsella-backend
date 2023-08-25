import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { User } from '../../entities/user';
import { UserRepository } from '../../repositories/user_repository';

export interface UpdateUserUseCase {
    execute(id:string, user: User): Promise<Either<Failure,ModelContainer<User>>>;
}

export class UpdateUser implements UpdateUserUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(id:string, user: User): Promise<Either<Failure,ModelContainer<User>>> {
		return await this.repository.updateUser(id, user);
	}
}