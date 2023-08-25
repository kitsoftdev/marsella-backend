import { Either } from '../../../../src/core/either';
import { Failure, GenericFailure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { HashPassword } from '../../../../src/core/password_hash';
import { PasswordModel } from '../../../../src/data/models/password_model';
import { PasswordRepository } from '../../../../src/domain/repositories/password_repository';
import { AddPassword } from '../../../../src/domain/usecases/password/add_password';

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

	beforeEach(() => {
		jest.clearAllMocks();
		mockPasswordRepository = new MockPasswordRepository();
	});

	test('el usecase de agregar usuario debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockPasswordRepository, 'addPassword').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(listPasswords[0]))));

		//act
		const useCase = new AddPassword(mockPasswordRepository);
		const result = await useCase.execute('ppp', hashPass1.hash);
		//assert
		expect(mockPasswordRepository.addPassword).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(ModelContainer.fromOneItem(listPasswords[0])));
	});

	test('el usecase de agregar usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockPasswordRepository, 'addPassword').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new AddPassword(mockPasswordRepository);
		const result = await useCase.execute('ppp', hashPass1.hash);
		//assert
		expect(mockPasswordRepository.addPassword).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});