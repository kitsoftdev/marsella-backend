import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { OrgaUserModel } from '../../../../src/data/models/orgauser_model';
import { OrgaUserRepository } from '../../../../src/domain/repositories/orgauser_repository';
import { EnableOrgaUser } from '../../../../src/domain/usecases/orgas/enable_orgauser';
import { MockOrgaUserRepository } from './orgauser_repository.mock';
describe('Habilitar usuario - Caso de uso', () => {
	
	let mockOrgaUserRepository: OrgaUserRepository;

	const listOrgaUsers: OrgaUserModel[] = [
		new OrgaUserModel('Súper OrgaUser', 'orgaUser', [], true, true),
		new OrgaUserModel('OrgaUser', 'Ouser', [], true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockOrgaUserRepository = new MockOrgaUserRepository();
	});

	test('el usecase de habilitar usuario debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockOrgaUserRepository, 'enableOrgaUser').mockImplementation(() => Promise.resolve(Either.right(true)));

		//act
		const useCase = new EnableOrgaUser(mockOrgaUserRepository);
		const result = await useCase.execute(listOrgaUsers[0].orgaId, listOrgaUsers[0].userId, false);
		//assert
		expect(mockOrgaUserRepository.enableOrgaUser).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(true));
	});

	test('el usecase de habilitar usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockOrgaUserRepository, 'enableOrgaUser').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new EnableOrgaUser(mockOrgaUserRepository);
		const result = await useCase.execute(listOrgaUsers[0].orgaId, listOrgaUsers[0].userId, false);
		//assert
		expect(mockOrgaUserRepository.enableOrgaUser).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});