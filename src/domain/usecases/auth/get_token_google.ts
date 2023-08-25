import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { Token } from '../../entities/token';
import { User } from '../../entities/user';
import { AuthRepository } from '../../repositories/auth_repository';

export interface GetTokenGoogleUseCase {
    execute(user:User, googleToken:string): Promise<Either<Failure,ModelContainer<Token>>>;
}

export class GetTokenGoogle implements GetTokenGoogleUseCase {
	repository: AuthRepository;
	constructor(repository: AuthRepository) {
		this.repository = repository;
	}

	async execute(user:User, googleToken:string): Promise<Either<Failure,ModelContainer<Token>>> {
		return await this.repository.getAuthGoogle(user, googleToken);
	}
}