import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Auth } from '../../entities/auth';
import { Token } from '../../entities/token';
import { AuthRepository } from '../../repositories/auth_repository';

export interface GetTokenUseCase {
    execute(auth:Auth): Promise<Either<Failure,ModelContainer<Token>>>;
}

export class GetToken implements GetTokenUseCase {
	repository: AuthRepository;
	constructor(repository: AuthRepository) {
		this.repository = repository;
	}

	async execute(auth:Auth): Promise<Either<Failure,ModelContainer<Token>>> {
		return await this.repository.getAuth(auth);
	}
}