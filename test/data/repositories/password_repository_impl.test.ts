import { MongoError } from 'mongodb';
import { ModelContainer } from '../../../src/core/model_container';
import { PasswordDataSource } from '../../../src/data/datasources/password_data_source';
import { PasswordModel } from '../../../src/data/models/password_model';
import { PasswordRepositoryImpl } from '../../../src/data/repositories/password_repository_impl';
import { DatabaseFailure, GenericFailure, NetworkFailure } from '../../../src/core/errors/failures';
import { HashPassword } from '../../../src/core/password_hash';
import { UserModel } from '../../../src/data/models/user_model';

class MockPasswordDataSource implements PasswordDataSource {
	updateByUserId(): Promise<ModelContainer<PasswordModel>> {
		throw new Error('Method not implemented.');
	}
	getByUserId(): Promise<ModelContainer<PasswordModel>> {
		throw new Error('Method not implemented.');
	}
	getMany(): Promise<ModelContainer<PasswordModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<PasswordModel>> {
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<PasswordModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<PasswordModel>>{
		throw new Error('Method not implemented.');
	}
	setId():PasswordModel{throw new Error('Method not implemented.');}
}

describe('Password Repository Implementation', () => {
	let mockPasswordDataSource: PasswordDataSource;
	let passwordRepository: PasswordRepositoryImpl;

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
		mockPasswordDataSource = new MockPasswordDataSource();
		passwordRepository = new PasswordRepositoryImpl(mockPasswordDataSource);
	});

	describe('addPassword', () => {
		test('debe llamar a los métodos de agregar', async () => {
			//arrange
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
			//act
			const result = await passwordRepository.addPassword('ppp', hashPass1.hash);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});	

			//assert
			expect(result.isRight());
			expect(mockPasswordDataSource.add).toBeCalledTimes(1);
			expect(value).toEqual(ModelContainer.fromOneItem(listPasswords[0]));
		});

		test('deberá generar error de Database al agregar un usuario', async () => {
			//arrange
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await passwordRepository.addPassword('ppp', hashPass1.hash);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al agregar un usuario', async () => {
			//arrange
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await passwordRepository.addPassword('ppp', hashPass1.hash);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al agregar un usuario', async () => {
			//arrange
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await passwordRepository.addPassword('ppp', hashPass1.hash);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

		test('deberá generar error genérico al agregar un password vacío', async () => {
			//arrange
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await passwordRepository.addPassword('ppp', '');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});
	
	describe('updatePassword', () => {
		test('debe llamar a las funciones de actualzar', async () => {
			//arrange
			jest.spyOn(mockPasswordDataSource, 'updateByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));			
			//act
			const result = await passwordRepository.updatePassword(listUsers[0].id, 'asd');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});			
			//assert
			expect(result.isRight());
			expect(mockPasswordDataSource.updateByUserId).toBeCalledTimes(1);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(1);

			//expect(value).toEqual(ModelContainer.fromOneItem(listPasswords[0]));
		});

		test('debe llamar a las funciones de agregar', async () => {
			//arrange
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(new ModelContainer<PasswordModel>([])));			
			//act
			const result = await passwordRepository.updatePassword(listUsers[0].id, 'asd');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});			
			//assert
			expect(result.isRight());
			expect(mockPasswordDataSource.add).toBeCalledTimes(1);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(1);

			//expect(value).toEqual(ModelContainer.fromOneItem(listPasswords[0]));
		});

		test('debe llamar a las funciones de actualzar y no actualizar', async () => {
			//arrange
			jest.spyOn(mockPasswordDataSource, 'updateByUserId').mockImplementation(() => Promise.resolve(new ModelContainer<PasswordModel>([])));

			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));			
			//act
			const result = await passwordRepository.updatePassword(listUsers[0].id, 'asd');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});			
			//assert
			expect(result.isRight());
			expect(mockPasswordDataSource.updateByUserId).toBeCalledTimes(1);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(1);

			//expect(value).toEqual(ModelContainer.fromOneItem(listPasswords[0]));
		});


		test('deberá generar error de Database al actualizar un usuario', async () => {
			//arrange
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));	
			jest.spyOn(mockPasswordDataSource, 'updateByUserId').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await passwordRepository.updatePassword(listUsers[0].id, 'asd');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al actualizar un usuario', async () => {
			//arrange
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));	
			jest.spyOn(mockPasswordDataSource, 'updateByUserId').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await passwordRepository.updatePassword(listUsers[0].id, 'asd');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al actualizar un usuario', async () => {
			//arrange
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));	
			jest.spyOn(mockPasswordDataSource, 'updateByUserId').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await passwordRepository.updatePassword(listUsers[0].id, 'asd');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

		test('deberá generar error genérico al actualizar un usuario', async () => {
			//arrange
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));	
			jest.spyOn(mockPasswordDataSource, 'updateByUserId').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await passwordRepository.updatePassword(listUsers[0].id, '');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	


	});

});