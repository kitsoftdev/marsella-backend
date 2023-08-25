import { Either } from '../../../../src/core/either';
import { Failure, GenericFailure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { HashPassword } from '../../../../src/core/password_hash';
import { PasswordModel } from '../../../../src/data/models/password_model';
import { UserModel } from '../../../../src/data/models/user_model';
import { PasswordRepository } from '../../../../src/domain/repositories/password_repository';
import { UpdatePassword } from '../../../../src/domain/usecases/password/update_password';

export class MockPasswordRepository implements PasswordRepository {
	addPassword() : Promise<Either<Failure, ModelContainer<PasswordModel>>> {
		throw new Error('Method not implemented.');
	}
	updatePassword() : Promise<Either<Failure, boolean>> {
		throw new Error('Method not implemented.');
	}
}

describe('Agregar usuario - Caso de uso', () => {
	
	let mockPasswordRepository: PasswordRepository;

	const hashPass1 = HashPassword.createHash('4321');
	const hashPass2 = HashPassword.createHash('1234');

	const listPasswords: PasswordModel[] = [
		new PasswordModel('ppp', hashPass1.hash, hashPass2.salt, true, true),
		new PasswordModel('aaa', hashPass2.hash, hashPass1.salt, true, false),
	];
	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockPasswordRepository = new MockPasswordRepository();
	});

	test('el usecase de actualizar usuario debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockPasswordRepository, 'updatePassword').mockImplementation(() => Promise.resolve(Either.right(true)));

		//act
		const useCase = new UpdatePassword(mockPasswordRepository);
		const result = await useCase.execute(listUsers[0].id, 'asd');
		//assert
		expect(mockPasswordRepository.updatePassword).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(true));
	});

	test('el usecase de actualizar usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockPasswordRepository, 'updatePassword').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new UpdatePassword(mockPasswordRepository);
		const result = await useCase.execute(listUsers[0].id, 'asd');
		//assert
		expect(mockPasswordRepository.updatePassword).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});