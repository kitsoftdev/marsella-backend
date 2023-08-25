import { Either } from '../../../../src/core/either';
import { Failure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { RoleModel } from '../../../../src/data/models/role_model';
import { RoleRepository } from '../../../../src/domain/repositories/role_repository';

export class MockRoleRepository implements RoleRepository {

	getRoles(): Promise<Either<Failure, ModelContainer<RoleModel>>> {
		throw new Error('Method not implemented.');
	}
	getRole(): Promise<Either<Failure, ModelContainer<RoleModel>>> {
		throw new Error('Method not implemented.');
	}
	enableRole(): Promise<Either<Failure, boolean>> {
		throw new Error('Method not implemented.');
	}

}