import { MongoError } from 'mongodb';
import { ModelContainer } from '../../../src/core/model_container';
import { OrgaUserDataSource } from '../../../src/data/datasources/orgauser_data_source';
import { OrgaUserModel } from '../../../src/data/models/orgauser_model';
import { OrgaUserRepositoryImpl } from '../../../src/data/repositories/orgauser_repository_impl';
import { DatabaseFailure, GenericFailure, NetworkFailure } from '../../../src/core/errors/failures';
import { UserDataSource } from '../../../src/data/datasources/user_data_source';
import { UserModel } from '../../../src/data/models/user_model';
import { OrgaDataSource } from '../../../src/data/datasources/orga_data_source';
import { OrgaModel } from '../../../src/data/models/orga_model';
import { Orga } from '../../../src/domain/entities/orga';

class MockOrgaUserDataSource implements OrgaUserDataSource {
	getByOrgaId(): Promise<ModelContainer<OrgaUserModel>> {
		throw new Error('Method not implemented.');
	}
	getByUserId(): Promise<ModelContainer<OrgaUserModel>> {
		throw new Error('Method not implemented.');
	}
	getOneBy(): Promise<ModelContainer<OrgaUserModel>> {
		throw new Error('Method not implemented.');
	}
	getMany(): Promise<ModelContainer<OrgaUserModel>> {
		throw new Error('Method not implemented.');
	}    

	getOne(): Promise<ModelContainer<OrgaUserModel>>{
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<OrgaUserModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<OrgaUserModel>>{
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	setId():OrgaUserModel{throw new Error('Method not implemented.');}
}

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

class MockOrgaDataSource implements OrgaDataSource {
	getByOrgasIdArray(): Promise<ModelContainer<OrgaModel>> {
		throw new Error('Method not implemented.');
	}
	getAll(): Promise<ModelContainer<OrgaModel>> {
		throw new Error('Method not implemented.');
	}
	getById(): Promise<ModelContainer<OrgaModel>> {
		throw new Error('Method not implemented.');
	}
	getByCode(): Promise<ModelContainer<OrgaModel>> {
		throw new Error('Method not implemented.');
	}
	getMany(): Promise<ModelContainer<OrgaModel>>{
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<OrgaModel>>{
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<OrgaModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<OrgaModel>>{
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
}

describe('OrgaUser Repository Implementation', () => {
	let mockOrgaUserDataSource: OrgaUserDataSource;
	let mockUserDataSource: UserDataSource;
	let mockOrgaDataSource: OrgaDataSource;
	let orgauserRepository: OrgaUserRepositoryImpl;

	const listOrgaUsers: OrgaUserModel[] = [
		new OrgaUserModel('Súper OrgaUser', 'orgaUser', [], true, true),
		new OrgaUserModel('OrgaUser', 'Ouser', [], true, false),
	];
	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];
	const listOrgas: OrgaModel[] = [
		new OrgaModel('ooo', 'Súper Orga', 'superOrga', true, true),
		new OrgaModel('rrr', 'Orga', 'orga', true, false),
	];
	beforeEach(() => {
		jest.clearAllMocks();
		mockOrgaUserDataSource = new MockOrgaUserDataSource();
		mockUserDataSource = new MockUserDataSource();
		mockOrgaDataSource = new MockOrgaDataSource();
		orgauserRepository = new OrgaUserRepositoryImpl(mockOrgaUserDataSource, mockUserDataSource, mockOrgaDataSource);
	});

	describe('getOrgaUsersByOrga', () => {
		test('deberá entregar lista de orgausuarios', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockOrgaUserDataSource, 'getByOrgaId').mockImplementation(() => Promise.resolve(new ModelContainer(expectedData)));
			//act
			const result = await orgauserRepository.getOrgaUsersByOrga('OrgaUser');
			//assert
			expect(result.isRight()).toBeTruthy();
			
		});
		
		test('deberá generar error de Database', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getByOrgaId').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgauserRepository.getOrgaUsersByOrga('OrgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getByOrgaId').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgauserRepository.getOrgaUsersByOrga('OrgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getByOrgaId').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgauserRepository.getOrgaUsersByOrga('OrgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});				
        
	});

	describe('getOrgaUsersByUser', () => {
		test('deberá entregar lista de orgausuarios', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockOrgaUserDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(new ModelContainer(expectedData)));
			//act
			const result = await orgauserRepository.getOrgaUsersByUser('orgaUser');
			//assert
			expect(result.isRight()).toBeTruthy();
			
		});
		
		test('deberá generar error de Database', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getByUserId').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgauserRepository.getOrgaUsersByUser('orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getByUserId').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgauserRepository.getOrgaUsersByUser('orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getByUserId').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgauserRepository.getOrgaUsersByUser('orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});				
        
	});

	describe('getOrgaUser', () => {
		test('debe entregar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
			//act
			const result = await orgauserRepository.getOrgaUser('OrgaUser','orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(result.isRight());
			expect(mockOrgaUserDataSource.getOneBy).toHaveBeenCalledWith('OrgaUser', 'orgaUser');
			expect(value).toStrictEqual(ModelContainer.fromOneItem(listOrgaUsers[0]));
		});

		test('deberá generar error de Database al buscar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgauserRepository.getOrgaUser('OrgaUser','orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al buscar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgauserRepository.getOrgaUser('OrgaUser','orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al buscar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgauserRepository.getOrgaUser('OrgaUser','orgaUser');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});

	describe('addOrgaUser', () => {
		test('debe llamar a los métodos de agregar', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));

			jest.spyOn(mockOrgaDataSource, 'getById').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));

			jest.spyOn(mockUserDataSource, 'getById').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));

			jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));

			//act
			const result = await orgauserRepository.addOrgaUser(listOrgaUsers[0].orgaId, listOrgaUsers[0].userId, listOrgaUsers[0].roles, listOrgaUsers[0].enabled, listOrgaUsers[0].builtIn);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});	

			//assert
			expect(result.isRight());
			expect(mockOrgaUserDataSource.add).toBeCalledTimes(1);
			expect(value).toEqual(ModelContainer.fromOneItem(listOrgaUsers[0]));
		});

		test('debe llamar a los métodos de agregar con orgas del user', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));

			jest.spyOn(mockOrgaDataSource, 'getById').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));

			listUsers[0].orgas = [{id: listOrgas[0].id, code:listOrgas[0].code}];

			jest.spyOn(mockUserDataSource, 'getById').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));

			jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));

			//act
			const result = await orgauserRepository.addOrgaUser(listOrgaUsers[0].orgaId, listOrgaUsers[0].userId, listOrgaUsers[0].roles, listOrgaUsers[0].enabled, listOrgaUsers[0].builtIn);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});	

			//assert
			expect(result.isRight());
			expect(mockOrgaUserDataSource.add).toBeCalledTimes(1);
			expect(value).toEqual(ModelContainer.fromOneItem(listOrgaUsers[0]));
		});

		test('deberá generar error de Database al agregar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgauserRepository.addOrgaUser('Súper OrgaUser', 'orgaUser', [], true, true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al agregar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgauserRepository.addOrgaUser('Súper OrgaUser', 'orgaUser', [], true, true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al agregar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgauserRepository.addOrgaUser('Súper OrgaUser', 'orgaUser', [], true, true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});

	describe('updateOrgaUser', () => {
		test('debe llamar a las funciones de actualzar', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'update').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));			
			//act
			const result = await orgauserRepository.updateOrgaUser('OrgaUser', 'Ouser', listOrgaUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});			
			//assert
			expect(result.isRight());
			expect(mockOrgaUserDataSource.update).toBeCalledTimes(1);
			expect(value).toEqual(ModelContainer.fromOneItem(listOrgaUsers[0]));
		});

		test('deberá generar error de Database al actualizar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'update').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));			
			//act
			const result = await orgauserRepository.updateOrgaUser('OrgaUser', 'Ouser', listOrgaUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al actualizar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'update').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));		
			//act
			const result = await orgauserRepository.updateOrgaUser('OrgaUser', 'Ouser', listOrgaUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al actualizar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'update').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));		
			//act
			const result = await orgauserRepository.updateOrgaUser('OrgaUser', 'Ouser', listOrgaUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

		test('deberá generar error genérico al no encontrar orgauser', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'update').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(new ModelContainer<OrgaUserModel>([])));		
			//act
			const result = await orgauserRepository.updateOrgaUser('OrgaUser', 'Ouser', listOrgaUsers[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});		

	});

	describe('enableOrgaUser', () => {
		test('debe llamar a las funciones de habilitación', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'enable').mockImplementation(() => Promise.resolve(true));
			//act
			const result = await orgauserRepository.enableOrgaUser('OrgaUser', 'Ouser', true);
			//assert
			expect(result.isRight());
			expect(mockOrgaUserDataSource.enable).toBeCalledTimes(1);
			expect(result.getOrElse(false)).toEqual(true);
		});

		test('deberá generar error de Database al habilitar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'enable').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgauserRepository.enableOrgaUser('OrgaUser', 'Ouser', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al habilitar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'enable').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgauserRepository.enableOrgaUser('OrgaUser', 'Ouser', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al habilitar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'enable').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgauserRepository.enableOrgaUser('OrgaUser', 'Ouser', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});

	describe('deleteOrgaUser', () => {
		test('debe llamar a las funciones de elminación', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'delete').mockImplementation(() => Promise.resolve(true));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));		
			jest.spyOn(mockUserDataSource, 'getById').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));	
			jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));				
			//act
			const result = await orgauserRepository.deleteOrgaUser('orgaId', 'userId');
			//assert
			expect(result.isRight());
			expect(mockOrgaUserDataSource.delete).toBeCalledTimes(1);
			expect(result.getOrElse(false)).toEqual(true);
		});

		test('deberá generar error de Database al eliminar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'delete').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));		
			//act
			const result = await orgauserRepository.deleteOrgaUser('orgaId', 'userId');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al eliminar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'delete').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));		
			//act
			const result = await orgauserRepository.deleteOrgaUser('orgaId', 'userId');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al eliminar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'delete').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));		
			//act
			const result = await orgauserRepository.deleteOrgaUser('orgaId', 'userId');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	
		
		test('deberá generar error genérico al eliminar y no encontrar un orgausuario', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'delete').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(new ModelContainer<OrgaUserModel>([])));		
			//act
			const result = await orgauserRepository.deleteOrgaUser('orgaId', 'userId');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	
	});

	describe('getOrgasByUserId', () => {
		test('debe llamar a las funciones de trae orgas por user', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));	
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));			
			//act
			const result = await orgauserRepository.getOrgasByUserId('userId');
			//assert
			expect(result.isRight());
			expect(mockOrgaUserDataSource.getByUserId).toBeCalledTimes(1);
			expect(result.getOrElse(ModelContainer.fromOneItem(listOrgas[1]))).toEqual(ModelContainer.fromOneItem(listOrgas[0]));
		});

		test('deberá generar error de Database al buscar orgas por user', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getByUserId').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));

			//act
			const result = await orgauserRepository.getOrgasByUserId('userId');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al orgas por user', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getByUserId').mockImplementation(() => Promise.reject(new Error('neterror')));

			//act
			const result = await orgauserRepository.getOrgasByUserId('userId');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error de Network al orgas por user', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getByUserId').mockImplementation(() => Promise.reject('generic'));

			//act
			const result = await orgauserRepository.getOrgasByUserId('userId');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});		

		test('deberá generar salida vacía al buscar orgas por user', async () => {
			//arrange
			jest.spyOn(mockOrgaUserDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(new ModelContainer<OrgaUserModel>([])));	
			//act
			const result = await orgauserRepository.getOrgasByUserId('userId');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isRight()).toBeTruthy();
		});	
		

	});

});