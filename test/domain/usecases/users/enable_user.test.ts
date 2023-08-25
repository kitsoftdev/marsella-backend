import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { UserModel } from '../../../../src/data/models/user_model';
import { UserRepository } from '../../../../src/domain/repositories/user_repository';
import { EnableUser } from '../../../../src/domain/usecases/users/enable_user';
import { MockUserRepository } from './user_repository.mock';
describe('Habilitar usuario - Caso de uso', () => {
	
	let mockUserRepository: UserRepository;

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockUserRepository = new MockUserRepository();
	});

	test('el usecase de habilitar usuario debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockUserRepository, 'enableUser').mockImplementation(() => Promise.resolve(Either.right(true)));

		//act
		const useCase = new EnableUser(mockUserRepository);
		const result = await useCase.execute(listUsers[0].id, false);
		//assert
		expect(mockUserRepository.enableUser).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(true));
	});

	test('el usecase de habilitar usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockUserRepository, 'enableUser').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new EnableUser(mockUserRepository);
		const result = await useCase.execute(listUsers[0].id, false);
		//assert
		expect(mockUserRepository.enableUser).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});