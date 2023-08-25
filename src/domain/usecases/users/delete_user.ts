import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { UserRepository } from '../../repositories/user_repository';

export interface DeleteUserUseCase {
    execute(id:string): Promise<Either<Failure,boolean>>;
}

export class DeleteUser implements DeleteUserUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(id:string): Promise<Either<Failure,boolean>> {
		return await this.repository.deleteUser(id);
	}
}