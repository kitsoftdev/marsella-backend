import { MongoError } from 'mongodb';
import { ModelContainer } from '../../../src/core/model_container';
import { OrgaDataSource } from '../../../src/data/datasources/orga_data_source';
import { OrgaModel } from '../../../src/data/models/orga_model';
import { OrgaRepositoryImpl } from '../../../src/data/repositories/orga_repository_impl';
import { DatabaseFailure, GenericFailure, NetworkFailure } from '../../../src/core/errors/failures';

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
	getMany(): Promise<ModelContainer<OrgaModel>> {
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
	setId():OrgaModel{throw new Error('Method not implemented.');}
}

describe('Orga Repository Implementation', () => {
	let mockOrgaDataSource: OrgaDataSource;
	let orgaRepository: OrgaRepositoryImpl;

	const listOrgas: OrgaModel[] = [
		new OrgaModel('ooo', 'Súper Orga', 'superOrga', true, true),
		new OrgaModel('rrr', 'Orga', 'orga', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockOrgaDataSource = new MockOrgaDataSource();
		orgaRepository = new OrgaRepositoryImpl(mockOrgaDataSource);
	});

	describe('getOrgas', () => {
		test('deberá entregar lista de orgas', async () => {
			//arrange
			const expectedData = listOrgas;
			jest.spyOn(mockOrgaDataSource, 'getAll').mockImplementation(() => Promise.resolve(new ModelContainer(expectedData)));
			//act
			const result = await orgaRepository.getOrgas(undefined);
			//assert
			expect(result.isRight()).toBeTruthy();
			
		});
		
		test('deberá generar error de Database', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'getAll').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgaRepository.getOrgas(undefined);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'getAll').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgaRepository.getOrgas(undefined);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'getAll').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgaRepository.getOrgas(undefined);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});		

	});

	describe('getOrga', () => {
		test('debe entregar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'getById').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));
			//act
			const result = await orgaRepository.getOrga('ooo');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(result.isRight());
			expect(mockOrgaDataSource.getById).toHaveBeenCalledWith('ooo');
			expect(value).toStrictEqual(ModelContainer.fromOneItem(listOrgas[0]));
		});

		test('deberá generar error de Database al buscar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'getById').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgaRepository.getOrga('ooo');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al buscar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'getById').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgaRepository.getOrga('ooo');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al buscar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'getById').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgaRepository.getOrga('ooo');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});


	describe('addOrga', () => {
		test('debe llamar a los métodos de agregar', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));
			//act
			const result = await orgaRepository.addOrga('ccc', 'Super', 'super', true, false);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});	

			//assert
			expect(result.isRight());
			expect(mockOrgaDataSource.add).toBeCalledTimes(1);
			expect(value).toEqual(ModelContainer.fromOneItem(listOrgas[0]));
		});

		test('deberá generar error de Database al agregar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'add').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgaRepository.addOrga('ccc', 'Super', 'super', true, false);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al agregar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'add').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgaRepository.addOrga('ccc', 'Super', 'super', true, false);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al agregar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgaRepository.addOrga('ccc', 'Super', 'super', true, false);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});

	describe('updateOrga', () => {
		test('debe llamar a las funciones de actualzar', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'update').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));
			//act
			const result = await orgaRepository.updateOrga('uuu', listOrgas[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});			
			//assert
			expect(result.isRight());
			expect(mockOrgaDataSource.update).toBeCalledTimes(1);
			expect(value).toEqual(ModelContainer.fromOneItem(listOrgas[0]));
		});

		test('deberá generar error de Database al actualizar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'update').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgaRepository.updateOrga('uuu', listOrgas[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al actualizar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'update').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgaRepository.updateOrga('uuu', listOrgas[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al actualizar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'update').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgaRepository.updateOrga('uuu', listOrgas[0]);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	


	});

	describe('enableOrga', () => {
		test('debe llamar a las funciones de habilitación', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'enable').mockImplementation(() => Promise.resolve(true));
			//act
			const result = await orgaRepository.enableOrga('ooo', true);
			//assert
			expect(result.isRight());
			expect(mockOrgaDataSource.enable).toBeCalledTimes(1);
			expect(result.getOrElse(false)).toEqual(true);
		});

		test('deberá generar error de Database al habilitar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'enable').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgaRepository.enableOrga('ooo', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al habilitar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'enable').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgaRepository.enableOrga('ooo', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al habilitar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'enable').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgaRepository.enableOrga('ooo', true);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});	

	});

	describe('deleteOrga', () => {
		test('debe llamar a las funciones de elminación', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'delete').mockImplementation(() => Promise.resolve(true));
			//act
			const result = await orgaRepository.deleteOrga('ooo');
			//assert
			expect(result.isRight());
			expect(mockOrgaDataSource.delete).toBeCalledTimes(1);
			expect(result.getOrElse(false)).toEqual(true);
		});

		test('deberá generar error de Database al eliminar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'delete').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgaRepository.deleteOrga('ooo');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al eliminar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'delete').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgaRepository.deleteOrga('ooo');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al eliminar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'delete').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgaRepository.deleteOrga('ooo');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});			
	});

	describe('existsOrga', () => {
		test('debe llamar a las funciones de existencia', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'getByCode').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));
			//act
			const result = await orgaRepository.existsOrga('ooo', '');
			//assert
			expect(result.isRight());
			expect(mockOrgaDataSource.getByCode).toBeCalledTimes(1);
			expect(result.getOrElse(ModelContainer.fromOneItem(listOrgas[1]))).toEqual(ModelContainer.fromOneItem(listOrgas[0]));
		});

		test('deberá generar error de Database al eliminar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'getByCode').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await orgaRepository.existsOrga('ooo', '');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al eliminar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'getByCode').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await orgaRepository.existsOrga('ooo', '');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al eliminar un orga', async () => {
			//arrange
			jest.spyOn(mockOrgaDataSource, 'getByCode').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await orgaRepository.existsOrga('ooo', '');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});			
	});



});