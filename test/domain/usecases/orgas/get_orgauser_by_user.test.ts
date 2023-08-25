import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { OrgaUserModel } from '../../../../src/data/models/orgauser_model';
import { OrgaUserRepository } from '../../../../src/domain/repositories/orgauser_repository';
import { GetOrgaUserByUser } from '../../../../src/domain/usecases/orgas/get_orgausers_by_user';
import { MockOrgaUserRepository } from './orgauser_repository.mock';
describe('Conseguir usuario - Caso de uso', () => {
	
	let mockOrgaUserRepository: OrgaUserRepository;

	const listOrgaUsers: OrgaUserModel[] = [
		new OrgaUserModel('Súper OrgaUser', 'orgaUser', [], true, true),
		new OrgaUserModel('OrgaUser', 'Ouser', [], true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockOrgaUserRepository = new MockOrgaUserRepository();
	});

	test('el usecase de conseguir orgauser por usuario debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockOrgaUserRepository, 'getOrgaUsersByUser').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(listOrgaUsers[0]))));

		//act
		const useCase = new GetOrgaUserByUser(mockOrgaUserRepository);
		const result = await useCase.execute(listOrgaUsers[0].userId);
		//assert
		expect(mockOrgaUserRepository.getOrgaUsersByUser).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(ModelContainer.fromOneItem(listOrgaUsers[0])));
	});

	test('el usecase de conseguir orgauser por usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockOrgaUserRepository, 'getOrgaUsersByUser').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new GetOrgaUserByUser(mockOrgaUserRepository);
		const result = await useCase.execute(listOrgaUsers[0].userId);
		//assert
		expect(mockOrgaUserRepository.getOrgaUsersByUser).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});