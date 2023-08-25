import request from 'supertest';
import { GetTokenUseCase } from '../../src/domain/usecases/auth/get_token';
import { RegisterUserUseCase } from '../../src/domain/usecases/auth/register_user';
import { ChangeOrgaUseCase } from '../../src/domain/usecases/auth/change_orga';
import AuthRouter from '../../src/presentation/auth_router';
import server from '../../src/server';
import { UserModel } from '../../src/data/models/user_model';
import { ModelContainer } from '../../src/core/model_container';
import { Failure, GenericFailure } from '../../src/core/errors/failures';
import { Either } from '../../src/core/either';
import { RouterResponse } from '../../src/core/router_response';
import { TokenModel } from '../../src/data/models/token_model';
import { Auth } from '../../src/domain/entities/auth';
import { generateJWT } from '../../src/core/jwt';
import { data_insert01} from '../../src/core/builtindata/load_data_01';
import { GetTokenGoogleUseCase } from '../../src/domain/usecases/auth/get_token_google';
import { User } from '../../src/domain/entities/user';

class MockGetTokenUseCase implements GetTokenUseCase {
	execute(): Promise<Either<Failure,ModelContainer<TokenModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockRegisterUserUseCase implements RegisterUserUseCase {
	execute(): Promise<Either<Failure,ModelContainer<UserModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockChangeOrgaUseCase implements ChangeOrgaUseCase {
	execute(): Promise<Either<Failure,ModelContainer<TokenModel>>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetTokenGoogleUseCase implements GetTokenGoogleUseCase {
	execute(): Promise<Either<Failure,ModelContainer<TokenModel>>> {
		throw new Error('Method not implemented.');
	}
}

describe('Auth Router', () => {

	const tokenModel = new TokenModel('token', 'a');
	const testAuth:Auth = {username:'user', password:'pass'};
	const testUser =new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false);
	const testBodyAuthGoogle: {user:User, googleToken:string} = {user:testUser, googleToken: 'aaa'};

	let mockGetTokenUseCase: GetTokenUseCase;
	let mockRegisterUserUseCase: RegisterUserUseCase;
	let mockChangeOrgaUseCase: MockChangeOrgaUseCase;
	let mockGetTokenGoogleUseCase:MockGetTokenGoogleUseCase;

	//carga de identificadores para las pruebas
	const testUserIdAdmin = data_insert01.users[1].id;
	const testUserIdUser1 = data_insert01.users[4].id;
	const testOrgaIdDefault = data_insert01.orgas[1].id;

	const testTokenAdmin = generateJWT({userId:testUserIdAdmin, orgaId: testOrgaIdDefault, roles: 'admin'}, 'lomba', 60*60);
	const testTokenUser1 = generateJWT({userId:testUserIdUser1, orgaId: testOrgaIdDefault, roles: 'user'}, 'lomba', 60*60);

	beforeAll(() => {
		mockGetTokenUseCase = new MockGetTokenUseCase();
		mockRegisterUserUseCase = new MockRegisterUserUseCase();
		mockChangeOrgaUseCase = new MockChangeOrgaUseCase();
		mockGetTokenGoogleUseCase = new MockGetTokenGoogleUseCase();

		server.use('/api/v1/auth', AuthRouter(mockGetTokenUseCase, mockRegisterUserUseCase, mockChangeOrgaUseCase, mockGetTokenGoogleUseCase));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	//auth de usuario vía POST
	describe('POST /auth', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockGetTokenUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(tokenModel))));

			//act
			const response = await request(server).post('/api/v1/auth').send(testAuth);
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetTokenUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetTokenUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/auth').send(testAuth);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockGetTokenUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetTokenUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/auth').send(testAuth);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockGetTokenUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});
    

	//registro de usuario vía POST
	describe('POST /auth/registration', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockRegisterUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(testUser))));

			//act
			const response = await request(server).post('/api/v1/auth/registration').send({user:testUser, auth:testAuth, roles:'user1'});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockRegisterUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockRegisterUserUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/auth/registration').send({user:testUser, auth:testAuth, roles:'user1'});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockRegisterUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockRegisterUserUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/auth/registration').send({user:testUser, auth:testAuth, roles:'user1'});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockRegisterUserUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});


	//cambio de token y orga vía PUT
	describe('PUT /auth', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockChangeOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(tokenModel))));

			//act
			const response = await request(server).put('/api/v1/auth').send(testAuth).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockChangeOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			jest.spyOn(mockChangeOrgaUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/auth').send(testAuth).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockChangeOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockChangeOrgaUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/auth').send(testAuth).set({Authorization: 'Bearer ' + testTokenUser1});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockChangeOrgaUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//auth de usuario vía POST con Google Auth
	describe('POST /auth/withgoogle', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockGetTokenGoogleUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(tokenModel))));

			//act
			const response = await request(server).post('/api/v1/auth/withgoogle').send(testBodyAuthGoogle);
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetTokenGoogleUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetTokenGoogleUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/auth/withgoogle').send(testBodyAuthGoogle);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockGetTokenGoogleUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetTokenGoogleUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/auth/withgoogle').send(testBodyAuthGoogle);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockGetTokenGoogleUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});
    


});