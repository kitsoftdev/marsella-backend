import { MongoError } from 'mongodb';
import { ModelContainer } from '../../../src/core/model_container';
import { RoleDataSource } from '../../../src/data/datasources/role_data_source';
import { RoleModel } from '../../../src/data/models/role_model';
import { RoleRepositoryImpl } from '../../../src/data/repositories/role_repository_impl';
import { DatabaseFailure, GenericFailure, NetworkFailure } from '../../../src/core/errors/failures';

class MockRoleDataSource implements RoleDataSource {
	getByName(): Promise<ModelContainer<RoleModel>> {
		throw new Error('Method not implemented.');
	}
	getAll(): Promise<ModelContainer<RoleModel>> {
		throw new Error('Method not implemented.');
	}
	getMany(): Promise<ModelContainer<RoleModel>> {
		throw new Error('Method not implemented.');
	}    

	getOne(): Promise<ModelContainer<RoleModel>>{
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<RoleModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<RoleModel>>{
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	setId():RoleModel{throw new Error('Method not implemented.');}
}

describe('Role Repository Implementation', () => {
	let mockRoleDataSource: RoleDataSource;
	let roleRepository: RoleRepositoryImpl;

	const listRoles: RoleModel[] = [
		new RoleModel('fff', true),
		new RoleModel('hhh', true),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockRoleDataSource = new MockRoleDataSource();
		roleRepository = new RoleRepositoryImpl(mockRoleDataSource);
	});

	describe('getRoles', () => {
		test('deberá entregar lista de roles', async () => {
			//arrange
			const expectedData = listRoles;
			jest.spyOn(mockRoleDataSource, 'getAll').mockImplementation(() => Promise.resolve(new ModelContainer(expectedData)));
			//act
			const result = await roleRepository.getRoles();
			//assert
			expect(result.isRight()).toBeTruthy();
			
		});
		
		test('deberá generar error de Database', async () => {
			//arrange
			jest.spyOn(mockRoleDataSource, 'getAll').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await roleRepository.getRoles();
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network', async () => {
			//arrange
			jest.spyOn(mockRoleDataSource, 'getAll').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await roleRepository.getRoles();
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico', async () => {
			//arrange
			jest.spyOn(mockRoleDataSource, 'getAll').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await roleRepository.getRoles();
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});				
        
	});

	describe('getRole', () => {
		test('debe entregar un rol', async () => {
			//arrange
			jest.spyOn(mockRoleDataSource, 'getByName').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listRoles[0])));
			//act
			const result = await roleRepository.getRole('aaa');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(result.isRight());
			expect(mockRoleDataSource.getByName).toHaveBeenCalledWith('aaa');
			expect(value).toStrictEqual(ModelContainer.fromOneItem(listRoles[0]));
		});

		test('deberá generar error de Database al buscar un rol', async () => {
			//arrange
			jest.spyOn(mockRoleDataSource, 'getByName').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await roleRepository.getRole('aaa');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al buscar un rol', async () => {
			//arrange
			jest.spyOn(mockRoleDataSource, 'getByName').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await roleRepository.getRole('aaa');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al buscar un rol', async () => {
			//arrange
			jest.spyOn(mockRoleDataSource, 'getByName').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await roleRepository.getRole('aaa');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});

	describe('enableRole', () => {
		test('debe llamar a las funciones de habilitación', async () => {
			//arrange
			jest.spyOn(mockRoleDataSource, 'enable').mockImplementation(() => Promise.resolve(true));
			//act
			const result = await roleRepository.enableRole('aaa', true);
			//assert
			expect(result.isRight());
			expect(mockRoleDataSource.enable).toBeCalledTimes(1);
			expect(result.getOrElse(false)).toEqual(true);
		});

		test('deberá generar error de Database al habilitar un rol', async () => {
			//arrange
			jest.spyOn(mockRoleDataSource, 'enable').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await roleRepository.enableRole('aaa', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al habilitar un rol', async () => {
			//arrange
			jest.spyOn(mockRoleDataSource, 'enable').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await roleRepository.enableRole('aaa', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al habilitar un rol', async () => {
			//arrange
			jest.spyOn(mockRoleDataSource, 'enable').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await roleRepository.enableRole('aaa', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});
	});
});