import request from 'supertest';
import { AddOrgaUserUseCase } from '../../src/domain/usecases/orgas/add_orgauser';
import { DeleteOrgaUserUseCase } from '../../src/domain/usecases/orgas/delete_orgauser';
import { EnableOrgaUserUseCase } from '../../src/domain/usecases/orgas/enable_orgauser';
import { GetOrgaUserByOrgasUseCase } from '../../src/domain/usecases/orgas/get_orgausers_by_orga';
import { GetOrgaUserByUsersUseCase } from '../../src/domain/usecases/orgas/get_orgausers_by_user';
import { UpdateOrgaUserUseCase } from '../../src/domain/usecases/orgas/update_orgauser';


import OrgaUserRouter from '../../src/presentation/orgauser_router';
import server from '../../src/server';
import { OrgaUserModel } from '../../src/data/models/orgauser_model';
import { ModelContainer } from '../../src/core/model_container';
import { Failure, GenericFailure } from '../../src/core/errors/failures';
import { Either } from '../../src/core/either';
import { RouterResponse } from '../../src/core/router_response';
import { generateJWT } from '../../src/core/jwt';
import { data_insert01 } from '../../src/core/builtindata/load_data_01';
import { GetOrgaUserUseCase } from '../../src/domain/usecases/orgas/get_orgauser';

class MockAddOrgaUserUseCase implements AddOrgaUserUseCase {
	execute(): Promise<Either<Failure,ModelContainer<OrgaUserModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockDeleteOrgaUserUseCase implements DeleteOrgaUserUseCase {
	execute(): Promise<Either<Failure,boolean>> {
		throw new Error('Method not implemented.');
	}
}

class MockEnableOrgaUserUseCase implements EnableOrgaUserUseCase {
	execute(): Promise<Either<Failure,boolean>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetOrgaUserByOrgasUseCase implements GetOrgaUserByOrgasUseCase {
	execute(): Promise<Either<Failure,ModelContainer<OrgaUserModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetOrgaUserByUsersUseCase implements GetOrgaUserByUsersUseCase {
	execute(): Promise<Either<Failure,ModelContainer<OrgaUserModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetOrgaUserUseCase implements GetOrgaUserUseCase {
	execute(): Promise<Either<Failure,ModelContainer<OrgaUserModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockUpdateOrgaUserUseCase implements UpdateOrgaUserUseCase {
	execute(): Promise<Either<Failure,ModelContainer<OrgaUserModel>>> {
		throw new Error('Method not implemented.');
	}
}

describe('OrgaUser Router', () => {
	let mockAddOrgaUserUseCase: AddOrgaUserUseCase;
	let mockDeleteOrgaUserUseCase: DeleteOrgaUserUseCase;
	let mockEnableOrgaUserUseCase: EnableOrgaUserUseCase;
	let mockGetOrgaUserByOrgasUseCase: GetOrgaUserByOrgasUseCase;
	let mockGetOrgaUserByUsersUseCase: GetOrgaUserByUsersUseCase;
	let mockGetOrgaUserUseCase: GetOrgaUserUseCase;
	let mockUpdateOrgaUserUseCase: UpdateOrgaUserUseCase;

	const listOrgaUsers: OrgaUserModel[] = [
		new OrgaUserModel('Súper OrgaUser', 'orgaUser', [], true, true),
		new OrgaUserModel('OrgaUser', 'Ouser', [], true, false),
	];

	//carga de identificadores para las pruebas
	const testUserIdAdmin = data_insert01.users[1].id;
	const testUserIdUser1 = data_insert01.users[4].id;
	const testOrgaIdDefault = data_insert01.orgas[1].id;

	const testTokenAdmin = generateJWT({userId:testUserIdAdmin, orgaId: testOrgaIdDefault, roles: 'admin'}, 'lomba', 60*60);
	const testTokenUser1 = generateJWT({userId:testUserIdUser1, orgaId: testOrgaIdDefault, roles: 'user'}, 'lomba', 60*60);

	beforeAll(() => {
		mockAddOrgaUserUseCase = new MockAddOrgaUserUseCase();
		mockDeleteOrgaUserUseCase = new MockDeleteOrgaUserUseCase();
		mockEnableOrgaUserUseCase = new MockEnableOrgaUserUseCase();
		mockGetOrgaUserByOrgasUseCase = new MockGetOrgaUserByOrgasUseCase();
		mockGetOrgaUserByUsersUseCase = new MockGetOrgaUserByUsersUseCase();
		mockGetOrgaUserUseCase = new MockGetOrgaUserUseCase();
		mockUpdateOrgaUserUseCase = new MockUpdateOrgaUserUseCase();

		server.use('/api/v1/orgauser', OrgaUserRouter(mockGetOrgaUserByOrgasUseCase, mockGetOrgaUserByUsersUseCase, mockGetOrgaUserUseCase, mockAddOrgaUserUseCase, mockUpdateOrgaUserUseCase, mockEnableOrgaUserUseCase, mockDeleteOrgaUserUseCase));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	//get orgaUsuarios por orgaId
	describe('GET /byorga/:orgaId', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockGetOrgaUserByOrgasUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<OrgaUserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/orgauser/byorga/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetOrgaUserByOrgasUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(expectedData.length);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockGetOrgaUserByOrgasUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<OrgaUserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/orgauser/byorga/1');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockGetOrgaUserByOrgasUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockGetOrgaUserByOrgasUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<OrgaUserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/orgauser/byorga/1').set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(403);
			expect(mockGetOrgaUserByOrgasUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetOrgaUserByOrgasUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get('/api/v1/orgauser/byorga/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetOrgaUserByOrgasUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetOrgaUserByOrgasUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).get('/api/v1/orgauser/byorga/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetOrgaUserByOrgasUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//get orgaUsuarios por userId
	describe('GET /byuser/:userId', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockGetOrgaUserByUsersUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<OrgaUserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/orgauser/byuser/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetOrgaUserByUsersUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(expectedData.length);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockGetOrgaUserByUsersUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<OrgaUserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/orgauser/byuser/1');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockGetOrgaUserByUsersUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockGetOrgaUserByUsersUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<OrgaUserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/orgauser/byuser/1').set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(403);
			expect(mockGetOrgaUserByUsersUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetOrgaUserByUsersUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get('/api/v1/orgauser/byuser/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetOrgaUserByUsersUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetOrgaUserByUsersUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).get('/api/v1/orgauser/byuser/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetOrgaUserByUsersUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//get un orgaUsuarios por orgaId y userId
	describe('GET /:orgaId/:userId', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockGetOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<OrgaUserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/orgauser/OrgaUser/Ouser').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(expectedData.length);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 404 no encontrado', async () => {
			//arrange
			jest.spyOn(mockGetOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<OrgaUserModel>([]))));

			//act
			const response = await request(server).get('/api/v1/orgauser/OrgaUserX/OuserX').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(404);
			expect(mockGetOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeUndefined();
			expect(roures.error).toBeDefined();

		});		

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockGetOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<OrgaUserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/orgauser/OrgaUser/Ouser');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockGetOrgaUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			const expectedData = listOrgaUsers;
			jest.spyOn(mockGetOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<OrgaUserModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/orgauser/OrgaUser/Ouser').set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(403);
			expect(mockGetOrgaUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get('/api/v1/orgauser/OrgaUser/Ouser').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetOrgaUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).get('/api/v1/orgauser/OrgaUser/Ouser').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//post de orgaUsuarios
	describe('POST /orgauser', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const inputData = listOrgaUsers[0];
			jest.spyOn(mockAddOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(inputData))));

			//act
			const response = await request(server).post('/api/v1/orgauser').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockAddOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const inputData = listOrgaUsers[0];
			jest.spyOn(mockAddOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(inputData))));

			//act
			const response = await request(server).post('/api/v1/orgauser').send(inputData);
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockAddOrgaUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			const inputData = listOrgaUsers[0];
			jest.spyOn(mockAddOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(inputData))));

			//act
			const response = await request(server).post('/api/v1/orgauser').send(inputData).set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(403);
			expect(mockAddOrgaUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			const inputData = listOrgaUsers[0];
			jest.spyOn(mockAddOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/orgauser').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			const inputData = listOrgaUsers[0];
			jest.spyOn(mockAddOrgaUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/orgauser').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//put de modificar orgaUsuarios con especificación de id en ruta
	describe('PUT /orgauser/:orgaId/:userId', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const inputData = listOrgaUsers[0];
			jest.spyOn(mockUpdateOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(inputData))));

			//act
			const response = await request(server).put('/api/v1/orgauser/1/2').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockUpdateOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const inputData = listOrgaUsers[0];
			jest.spyOn(mockUpdateOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(inputData))));

			//act
			const response = await request(server).put('/api/v1/orgauser/1/2').send(inputData);
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockUpdateOrgaUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			const inputData = listOrgaUsers[0];
			jest.spyOn(mockUpdateOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(inputData))));

			//act
			const response = await request(server).put('/api/v1/orgauser/1/2').send(inputData).set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(403);
			expect(mockUpdateOrgaUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			const inputData = listOrgaUsers[0];
			jest.spyOn(mockUpdateOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/orgauser/1/2').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdateOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			const inputData = listOrgaUsers[0];
			jest.spyOn(mockUpdateOrgaUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/orgauser/1/2').send(inputData).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdateOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//put de habilitación de orgaUsuario con id en ruta
	describe('PUT /orgauser/enable/:orgaId/:userId', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockEnableOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).put('/api/v1/orgauser/enable/1/2?enable=false').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockEnableOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			jest.spyOn(mockEnableOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).put('/api/v1/orgauser/enable/1/2?enable=false');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockEnableOrgaUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			jest.spyOn(mockEnableOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).put('/api/v1/orgauser/enable/1/2?enable=false').set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(403);
			expect(mockEnableOrgaUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockEnableOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/orgauser/enable/1/2?enable=true').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockEnableOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockEnableOrgaUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/orgauser/enable/1/2?enable=false').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockEnableOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//delete de orgaUsuario por id en ruta
	describe('DELETE /:orgaId/:userId', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockDeleteOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).delete('/api/v1/orgauser/1/2').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockDeleteOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			jest.spyOn(mockDeleteOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).delete('/api/v1/orgauser/1/2');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockDeleteOrgaUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			jest.spyOn(mockDeleteOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).delete('/api/v1/orgauser/1/2').set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(403);
			expect(mockDeleteOrgaUserUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockDeleteOrgaUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).delete('/api/v1/orgauser/1/2').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockDeleteOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockDeleteOrgaUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error()));

			//act
			const response = await request(server).delete('/api/v1/orgauser/1/2').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockDeleteOrgaUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});    
});