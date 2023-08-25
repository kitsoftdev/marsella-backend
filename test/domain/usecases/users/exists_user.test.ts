import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { UserModel } from '../../../../src/data/models/user_model';
import { UserRepository } from '../../../../src/domain/repositories/user_repository';
import { ExistsUser } from '../../../../src/domain/usecases/users/exists_user';
import {GetUser} from '../../../../src/domain/usecases/users/get_user';
import { MockUserRepository } from './user_repository.mock';
describe('Conseguir usuario - Caso de uso', () => {
	
	let mockUserRepository: UserRepository;

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockUserRepository = new MockUserRepository();
	});

	test('el usecase verifica existe usuario debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockUserRepository, 'existsUser').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(listUsers[0]))));

		//act
		const useCase = new ExistsUser(mockUserRepository);
		const result = await useCase.execute('a', 'admin', 'admin@mp.com');
		//assert
		expect(mockUserRepository.existsUser).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(ModelContainer.fromOneItem(listUsers[0])));
	});

	test('el usecase de conseguir usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockUserRepository, 'existsUser').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new ExistsUser(mockUserRepository);
		const result = await useCase.execute('a', 'admin', 'admin@mp.com');
		//assert
		expect(mockUserRepository.existsUser).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});