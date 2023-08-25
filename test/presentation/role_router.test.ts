import request from 'supertest';
import { EnableRoleUseCase } from '../../src/domain/usecases/roles/enable_role';
import { GetRoleUseCase } from '../../src/domain/usecases/roles/get_role';
import { GetRolesUseCase } from '../../src/domain/usecases/roles/get_roles';


import RoleRouter from '../../src/presentation/role_router';
import server from '../../src/server';
import { RoleModel } from '../../src/data/models/role_model';
import { ModelContainer } from '../../src/core/model_container';
import { Failure, GenericFailure } from '../../src/core/errors/failures';
import { Either } from '../../src/core/either';
import { RouterResponse } from '../../src/core/router_response';
import { generateJWT } from '../../src/core/jwt';
import { data_insert01 } from '../../src/core/builtindata/load_data_01';

class MockEnableRoleUseCase implements EnableRoleUseCase {
	execute(): Promise<Either<Failure,boolean>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetRoleUseCase implements GetRoleUseCase {
	execute(): Promise<Either<Failure,ModelContainer<RoleModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetRolesUseCase implements GetRolesUseCase {
	execute(): Promise<Either<Failure,ModelContainer<RoleModel>>> {
		throw new Error('Method not implemented.');
	}
}

describe('Role Router', () => {
	let mockEnableRoleUseCase: EnableRoleUseCase;
	let mockGetRoleUseCase: GetRoleUseCase;
	let mockGetRolesUseCase: GetRolesUseCase;

	const listRoles: RoleModel[] = [
		new RoleModel('fff', true),
		new RoleModel('hhh', true),
	];

	//carga de identificadores para las pruebas
	const testUserIdAdmin = data_insert01.users[1].id;
	const testUserIdUser1 = data_insert01.users[4].id;
	const testOrgaIdDefault = data_insert01.orgas[1].id;

	const testTokenAdmin = generateJWT({userId:testUserIdAdmin, orgaId: testOrgaIdDefault, roles: 'admin'}, 'lomba', 60*60);
	const testTokenUser1 = generateJWT({userId:testUserIdUser1, orgaId: testOrgaIdDefault, roles: 'user'}, 'lomba', 60*60);

	beforeAll(() => {
		mockEnableRoleUseCase = new MockEnableRoleUseCase();
		mockGetRoleUseCase = new MockGetRoleUseCase();
		mockGetRolesUseCase = new MockGetRolesUseCase();

		server.use('/api/v1/role', RoleRouter(mockGetRoleUseCase, mockGetRolesUseCase, mockEnableRoleUseCase));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	//get de rol por name
	describe('GET /role:name', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = listRoles[0];
			jest.spyOn(mockGetRoleUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));

			//act
			const response = await request(server).get('/api/v1/role/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetRoleUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 404 no encontrado', async () => {
			//arrange
			jest.spyOn(mockGetRoleUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<RoleModel>([]))));

			//act
			const response = await request(server).get('/api/v1/role/xxxx').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(404);
			expect(mockGetRoleUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeUndefined();
			expect(roures.error).toBeDefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const expectedData = listRoles[0];
			jest.spyOn(mockGetRoleUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));

			//act
			const response = await request(server).get('/api/v1/role/1');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockGetRoleUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			const expectedData = listRoles[0];
			jest.spyOn(mockGetRoleUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));

			//act
			const response = await request(server).get('/api/v1/role/1').set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(403);
			expect(mockGetRoleUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetRoleUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get('/api/v1/role/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetRoleUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).get('/api/v1/role/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//get roles por orgaId
	describe('GET /', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = listRoles;
			jest.spyOn(mockGetRolesUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<RoleModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/role/').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetRolesUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(expectedData.length);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const expectedData = listRoles;
			jest.spyOn(mockGetRolesUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<RoleModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/role/');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockGetRolesUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			const expectedData = listRoles;
			jest.spyOn(mockGetRolesUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<RoleModel>(expectedData))));

			//act
			const response = await request(server).get('/api/v1/role/').set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(403);
			expect(mockGetRolesUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetRolesUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get('/api/v1/role/').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetRolesUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetRolesUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).get('/api/v1/role/').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(mockGetRolesUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//put de habilitación de rol con id en ruta
	describe('PUT /role/enable/:id', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockEnableRoleUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).put('/api/v1/role/enable/1?enable=false').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockEnableRoleUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			jest.spyOn(mockEnableRoleUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).put('/api/v1/role/enable/1?enable=false');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockEnableRoleUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			jest.spyOn(mockEnableRoleUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).put('/api/v1/role/enable/1?enable=false').set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(403);
			expect(mockEnableRoleUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockEnableRoleUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/role/enable/1?enable=true').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockEnableRoleUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockEnableRoleUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/role/enable/1?enable=false').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockEnableRoleUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});
});