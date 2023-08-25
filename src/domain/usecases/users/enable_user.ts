import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { UserRepository } from '../../repositories/user_repository';

export interface EnableUserUseCase {
    execute(id:string, enableOrDisable: boolean): Promise<Either<Failure,boolean>>;
}

export class EnableUser implements EnableUserUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(id:string, enableOrDisable: boolean): Promise<Either<Failure,boolean>> {
		return await this.repository.enableUser(id, enableOrDisable);
	}
}