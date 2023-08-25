import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { UserModel } from '../../../../src/data/models/user_model';
import { UserRepository } from '../../../../src/domain/repositories/user_repository';
import { DeleteUser } from '../../../../src/domain/usecases/users/delete_user';
import { MockUserRepository } from './user_repository.mock';
describe('Eliminar usuario - Caso de uso', () => {
	
	let mockUserRepository: UserRepository;

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockUserRepository = new MockUserRepository();
	});

	test('el usecase de eliminar usuario debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockUserRepository, 'deleteUser').mockImplementation(() => Promise.resolve(Either.right(true)));

		//act
		const useCase = new DeleteUser(mockUserRepository);
		const result = await useCase.execute(listUsers[0].id);
		//assert
		expect(mockUserRepository.deleteUser).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(true));
	});

	test('el usecase de delete usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockUserRepository, 'deleteUser').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new DeleteUser(mockUserRepository);
		const result = await useCase.execute(listUsers[0].id);
		//assert
		expect(mockUserRepository.deleteUser).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});