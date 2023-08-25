import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { OrgaUserModel } from '../../../../src/data/models/orgauser_model';
import { OrgaUserRepository } from '../../../../src/domain/repositories/orgauser_repository';
import { AddOrgaUser } from '../../../../src/domain/usecases/orgas/add_orgauser';
import { MockOrgaUserRepository } from './orgauser_repository.mock';
describe('Agregar usuario - Caso de uso', () => {
	
	let mockOrgaUserRepository: OrgaUserRepository;

	const listOrgaUsers: OrgaUserModel[] = [
		new OrgaUserModel('Súper OrgaUser', 'orgaUser', [], true, true),
		new OrgaUserModel('OrgaUser', 'Ouser', [], true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockOrgaUserRepository = new MockOrgaUserRepository();
	});

	test('el usecase de agregar usuario debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockOrgaUserRepository, 'addOrgaUser').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(listOrgaUsers[0]))));

		//act
		const useCase = new AddOrgaUser(mockOrgaUserRepository);
		const result = await useCase.execute(listOrgaUsers[0]);
		//assert
		expect(mockOrgaUserRepository.addOrgaUser).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(ModelContainer.fromOneItem(listOrgaUsers[0])));
	});

	test('el usecase de agregar usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockOrgaUserRepository, 'addOrgaUser').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new AddOrgaUser(mockOrgaUserRepository);
		const result = await useCase.execute(listOrgaUsers[0]);
		//assert
		expect(mockOrgaUserRepository.addOrgaUser).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});