import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { UserModel } from '../../../../src/data/models/user_model';
import { UserRepository } from '../../../../src/domain/repositories/user_repository';
import {GetUsersByOrgaId} from '../../../../src/domain/usecases/users/get_users_by_orga';
import { MockUserRepository } from './user_repository.mock';
describe('Conseguir usuario por orga - Caso de uso', () => {
	
	let mockUserRepository: UserRepository;

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockUserRepository = new MockUserRepository();
	});

	test('el usecase de conseguir usuario por orga debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockUserRepository, 'getUsersByOrgaId').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<UserModel>(listUsers))));

		//act
		const useCase = new GetUsersByOrgaId(mockUserRepository);
		const result = await useCase.execute('text','aaa');
		//assert
		expect(mockUserRepository.getUsersByOrgaId).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(new ModelContainer<UserModel>(listUsers)));
	});

	test('el usecase de conseguir usuario por orga debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockUserRepository, 'getUsersByOrgaId').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new GetUsersByOrgaId(mockUserRepository);
		const result = await useCase.execute('text','aaa');
		//assert
		expect(mockUserRepository.getUsersByOrgaId).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});