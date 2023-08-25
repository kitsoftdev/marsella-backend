import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { User } from '../../entities/user';
import { UserRepository } from '../../repositories/user_repository';

export interface GetUsersByOrgaIdUseCase {
    execute(searchText: string, orgaId: string, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure,ModelContainer<User>>>;
}

export class GetUsersByOrgaId implements GetUsersByOrgaIdUseCase {
	repository: UserRepository;
	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute(searchText: string, orgaId: string, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure,ModelContainer<User>>> {
		return await this.repository.getUsersByOrgaId(searchText, orgaId, sort, pageIndex, itemsPerPage);
	}
}