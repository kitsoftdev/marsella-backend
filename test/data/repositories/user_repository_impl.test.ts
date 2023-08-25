import { MongoError } from 'mongodb';
import { ModelContainer } from '../../../src/core/model_container';
import { UserDataSource } from '../../../src/data/datasources/user_data_source';
import { UserModel } from '../../../src/data/models/user_model';
import { UserRepositoryImpl } from '../../../src/data/repositories/user_repository_impl';
import { DatabaseFailure, GenericFailure, NetworkFailure } from '../../../src/core/errors/failures';

class MockUserDataSource implements UserDataSource {
	getIfExistsByUsernameEmail(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getByUsernameEmail(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getMany(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<UserModel>>{
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<UserModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<UserModel>>{
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	setId():UserModel{throw new Error('Method not implemented.');}
	getByOrgaId(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getWhoAreNotInOrga(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getById(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getByUsernameOrEmail(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
}

describe('User Repository Implementation', () => {
	let mockUserDataSource: UserDataSource;
	let userRepository: UserRepositoryImpl;

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockUserDataSource = new MockUserDataSource();
		userRepository = new UserRepositoryImpl(mockUserDataSource);
	});

	describe('getUsersByOrgaId', () => {
		test('deberá entregar lista de usuarios', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockUserDataSource, 'getByOrgaId').mockImplementation(() => Promise.resolve(new ModelContainer(expectedData)));
			//act
			const result = await userRepository.getUsersByOrgaId('text', 'aaa', undefined);
			//assert
			expect(result.isRight()).toBeTruthy();
			
		});
		
		test('deberá generar error de Database', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByOrgaId').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await userRepository.getUsersByOrgaId('text', 'aaa', undefined);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByOrgaId').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await userRepository.getUsersByOrgaId('text', 'aaa', undefined);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByOrgaId').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await userRepository.getUsersByOrgaId('text', 'aaa', undefined);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});				
        
	});

	describe('getUser', () => {
		test('debe entregar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getById').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			//act
			const result = await userRepository.getUser('aaa');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(result.isRight());
			expect(mockUserDataSource.getById).toHaveBeenCalledWith('aaa');
			expect(value).toStrictEqual(ModelContainer.fromOneItem(listUsers[0]));
		});

		test('deberá generar error de Database al buscar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getById').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await userRepository.getUser('aaa');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al buscar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getById').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await userRepository.getUser('aaa');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al buscar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getById').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await userRepository.getUser('aaa');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});


	describe('addUser', () => {
		test('debe llamar a los métodos de agregar', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			//act
			const result = await userRepository.addUser('aaa', 'admin', 'admin', 'mp@mp.com', true, false);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});	

			//assert
			expect(result.isRight());
			expect(mockUserDataSource.add).toBeCalledTimes(1);
			expect(value).toEqual(ModelContainer.fromOneItem(listUsers[0]));
		});

		test('deberá generar error de Database al agregar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await userRepository.addUser('aaa', 'admin', 'admin', 'mp@mp.com', true, false);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al agregar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await userRepository.addUser('aaa', 'admin', 'admin', 'mp@mp.com', true, false);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al agregar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await userRepository.addUser('aaa', 'admin', 'admin', 'mp@mp.com', true, false);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});

	describe('updateUser', () => {
		test('debe llamar a las funciones de actualzar', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			//act
			const result = await userRepository.updateUser('uuu', listUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});			
			//assert
			expect(result.isRight());
			expect(mockUserDataSource.update).toBeCalledTimes(1);
			expect(value).toEqual(ModelContainer.fromOneItem(listUsers[0]));
		});

		test('deberá generar error de Database al actualizar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await userRepository.updateUser('uuu', listUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al actualizar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await userRepository.updateUser('uuu', listUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al actualizar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await userRepository.updateUser('uuu', listUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	


	});

	describe('enableUser', () => {
		test('debe llamar a las funciones de habilitación', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'enable').mockImplementation(() => Promise.resolve(true));
			//act
			const result = await userRepository.enableUser('aaa', true);
			//assert
			expect(result.isRight());
			expect(mockUserDataSource.enable).toBeCalledTimes(1);
			expect(result.getOrElse(false)).toEqual(true);
		});

		test('deberá generar error de Database al habilitar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'enable').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await userRepository.enableUser('aaa', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al habilitar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'enable').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await userRepository.enableUser('aaa', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al habilitar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'enable').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await userRepository.enableUser('aaa', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});

	describe('deleteUser', () => {
		test('debe llamar a las funciones de elminación', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'delete').mockImplementation(() => Promise.resolve(true));
			//act
			const result = await userRepository.deleteUser('aaa');
			//assert
			expect(result.isRight());
			expect(mockUserDataSource.delete).toBeCalledTimes(1);
			expect(result.getOrElse(false)).toEqual(true);
		});

		test('deberá generar error de Database al eliminar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'delete').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await userRepository.deleteUser('aaa');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al eliminar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'delete').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await userRepository.deleteUser('aaa');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al eliminar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'delete').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await userRepository.deleteUser('aaa');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});			
	});

	describe('getUsersNotInOrga', () => {
		test('deberá entregar lista de usuarios que no están en la orga', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockUserDataSource, 'getWhoAreNotInOrga').mockImplementation(() => Promise.resolve(new ModelContainer(expectedData)));
			//act
			const result = await userRepository.getUsersNotInOrga('text', 'aaa', undefined);
			//assert
			expect(result.isRight()).toBeTruthy();
			
		});
		
		test('deberá generar error de Database', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getWhoAreNotInOrga').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await userRepository.getUsersNotInOrga('text', 'aaa', undefined);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getWhoAreNotInOrga').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await userRepository.getUsersNotInOrga('text', 'aaa', undefined);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getWhoAreNotInOrga').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await userRepository.getUsersNotInOrga('text', 'aaa', undefined);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});				
        
	});

	describe('existsUser', () => {
		test('deberá entregar usuario si existe', async () => {
			//arrange
			const expectedData = listUsers;
			jest.spyOn(mockUserDataSource, 'getIfExistsByUsernameEmail').mockImplementation(() => Promise.resolve(new ModelContainer(expectedData)));
			//act
			const result = await userRepository.existsUser('aaa', 'user', 'email');
			//assert
			expect(result.isRight()).toBeTruthy();
			
		});
		
		test('deberá generar error de Database', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getIfExistsByUsernameEmail').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await userRepository.existsUser('aaa', 'user', 'email');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getIfExistsByUsernameEmail').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await userRepository.existsUser('aaa', 'user', 'email');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getIfExistsByUsernameEmail').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await userRepository.existsUser('aaa', 'user', 'email');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});				
        
	});

});