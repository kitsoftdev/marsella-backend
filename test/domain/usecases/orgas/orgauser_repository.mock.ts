import { Either } from '../../../../src/core/either';
import { Failure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { OrgaModel } from '../../../../src/data/models/orga_model';
import { OrgaUserModel } from '../../../../src/data/models/orgauser_model';
import { OrgaUserRepository } from '../../../../src/domain/repositories/orgauser_repository';

export class MockOrgaUserRepository implements OrgaUserRepository {

	getOrgaUsersByOrga(): Promise<Either<Failure, ModelContainer<OrgaUserModel>>> {
		throw new Error('Method not implemented.');
	}
	getOrgaUsersByUser(): Promise<Either<Failure, ModelContainer<OrgaUserModel>>> {
		throw new Error('Method not implemented.');
	}
	getOrgaUser(): Promise<Either<Failure, ModelContainer<OrgaUserModel>>> {
		throw new Error('Method not implemented.');
	}
	addOrgaUser() : Promise<Either<Failure, ModelContainer<OrgaUserModel>>> {
		throw new Error('Method not implemented.');
	}
	updateOrgaUser() : Promise<Either<Failure, ModelContainer<OrgaUserModel>>> {
		throw new Error('Method not implemented.');
	}
	enableOrgaUser(): Promise<Either<Failure, boolean>> {
		throw new Error('Method not implemented.');
	}
	deleteOrgaUser(): Promise<Either<Failure,boolean>> {
		throw new Error('Method not implemented.');
	}
	getOrgasByUserId() : Promise<Either<Failure, ModelContainer<OrgaModel>>>{
		throw new Error('Method not implemented.');
	}
}