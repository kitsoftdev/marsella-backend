import request from 'supertest';
import { data_insert01 } from '../../src/core/builtindata/load_data_01';
import { Either } from '../../src/core/either';
import { Failure, GenericFailure } from '../../src/core/errors/failures';
import { generateJWT } from '../../src/core/jwt';
import { ModelContainer } from '../../src/core/model_container';
import { HashPassword } from '../../src/core/password_hash';
import { RouterResponse } from '../../src/core/router_response';
import { PasswordModel } from '../../src/data/models/password_model';
import { Auth } from '../../src/domain/entities/auth';
import { AddPasswordUseCase } from '../../src/domain/usecases/password/add_password';
import { UpdatePasswordUseCase } from '../../src/domain/usecases/password/update_password';
import AuthRouter from '../../src/presentation/password_router';
import server from '../../src/server';

class MockAddPasswordUseCase implements AddPasswordUseCase {
	execute(): Promise<Either<Failure,ModelContainer<PasswordModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockUpdatePasswordUseCase implements UpdatePasswordUseCase {
	execute(): Promise<Either<Failure,boolean>> {
		throw new Error('Method not implemented.');
	}
}

describe('Auth Router', () => {

	const hashPass1 = HashPassword.createHash('4321');
	const hashPass2 = HashPassword.createHash('1234');

	const listPasswords: PasswordModel[] = [
		new PasswordModel('ppp', hashPass1.hash, hashPass2.salt, true, true),
		new PasswordModel('aaa', hashPass2.hash, hashPass1.salt, true, false),
	];

	const testAuth:Auth = {username:'user', password:'pass'};

	let mockAddPasswordUseCase: AddPasswordUseCase;
	let mockUpdatePasswordUseCase: UpdatePasswordUseCase;

	//carga de identificadores para las pruebas
	const testUserIdAdmin = data_insert01.users[1].id;
	const testOrgaIdDefault = data_insert01.orgas[1].id;

	const testTokenAdmin = generateJWT({userId:testUserIdAdmin, orgaId: testOrgaIdDefault, roles: 'admin'}, 'lomba', 60*60);

	beforeAll(() => {
		mockAddPasswordUseCase = new MockAddPasswordUseCase();
		mockUpdatePasswordUseCase = new MockUpdatePasswordUseCase();

		server.use('/api/v1/password', AuthRouter(mockAddPasswordUseCase, mockUpdatePasswordUseCase));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	//password de usuario vía POST
	describe('POST /add', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockAddPasswordUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(listPasswords[0]))));

			//act
			const response = await request(server).post('/api/v1/password/add').send(testAuth);
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockAddPasswordUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockAddPasswordUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/password/add').send(testAuth);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddPasswordUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockAddPasswordUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/password/add').send(testAuth);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddPasswordUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	describe('PUT /add', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockUpdatePasswordUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).put('/api/v1/password/aaa').send(testAuth).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockUpdatePasswordUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockUpdatePasswordUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/password/aaa').send(testAuth).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdatePasswordUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockUpdatePasswordUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/password/aaa').send(testAuth).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdatePasswordUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de no especificar password', async () => {
			//arrange
			jest.spyOn(mockUpdatePasswordUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/password/aaa').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdatePasswordUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	describe('PUT /profile/:id', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockUpdatePasswordUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).put('/api/v1/password/profile/aaa').send(testAuth).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockUpdatePasswordUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockUpdatePasswordUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/password/profile/aaa').send(testAuth).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdatePasswordUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockUpdatePasswordUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/password/profile/aaa').send(testAuth).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdatePasswordUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de no especificar password', async () => {
			//arrange
			jest.spyOn(mockUpdatePasswordUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/password/profile/aaa').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdatePasswordUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

});