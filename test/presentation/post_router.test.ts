import request from 'supertest';


import { data_insert01 } from '../../src/core/builtindata/load_data_01';
import { data_insert02 } from '../../src/core/builtindata/load_data_02';
import { Either } from '../../src/core/either';
import { Failure, GenericFailure } from '../../src/core/errors/failures';
import { generateJWT } from '../../src/core/jwt';
import { ModelContainer } from '../../src/core/model_container';
import { RouterResponse } from '../../src/core/router_response';
import { AddTextPostUseCase } from '../../src/domain/usecases/posts/add_text_post';
import { DeletePostUseCase } from '../../src/domain/usecases/posts/delete_post';
import { GetPostsUseCase } from '../../src/domain/usecases/posts/get_posts';
import { UpdatePostUseCase } from '../../src/domain/usecases/posts/update_post';
import PostsRouter from '../../src/presentation/post_router';
import server from '../../src/server';
import { EnablePostUseCase } from '../../src/domain/usecases/posts/enable_post';
import { ChangeStagePostUseCase } from '../../src/domain/usecases/posts/change_stage_post';
import { GetAdminViewPostsUseCase } from '../../src/domain/usecases/posts/get_adminview_post';
import { Post } from '../../src/domain/entities/workflow/post';
import { PostModel } from '../../src/data/models/workflow/post_model';
import { GetPostUseCase } from '../../src/domain/usecases/posts/get_post';
import { AddMultiPostUseCase } from '../../src/domain/usecases/posts/add_multi_post';
import { GetPostWithUserUseCase } from '../../src/domain/usecases/posts/get_withuser_post';

class MockAddTextPostUseCase implements AddTextPostUseCase {
	execute(): Promise<Either<Failure,ModelContainer<Post>>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetPostsUseCase implements GetPostsUseCase {
	execute(): Promise<Either<Failure,ModelContainer<Post>>> {
		throw new Error('Method not implemented.');
	}
}


class MockUpdatePostUseCase implements UpdatePostUseCase {
	execute(): Promise<Either<Failure,ModelContainer<Post>>> {
		throw new Error('Method not implemented.');
	}
}

class MockDeletePostUseCase implements DeletePostUseCase {
	execute(): Promise<Either<Failure,ModelContainer<Post>>> {
		throw new Error('Method not implemented.');
	}
}

class MockEnablePostUseCase implements EnablePostUseCase {
	execute(): Promise<Either<Failure, boolean>> {
		throw new Error('Method not implemented.');
	}
}

class MockChangeStagePostUseCase implements ChangeStagePostUseCase{
	execute(): Promise<Either<Failure, ModelContainer<Post>>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetAdminViewPostUseCase implements GetAdminViewPostsUseCase{
	execute(): Promise<Either<Failure, ModelContainer<Post>>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetPostUseCase implements GetPostUseCase{
	execute(): Promise<Either<Failure, ModelContainer<Post>>> {
		throw new Error('Method not implemented.');
	}
}

class MockAddMultiPostUseCase implements AddMultiPostUseCase{
	execute(): Promise<Either<Failure, ModelContainer<Post>>> {
		throw new Error('Method not implemented.');
	}
}

class MockGetPostWithUserUseCase implements GetPostWithUserUseCase{
	execute(): Promise<Either<Failure, ModelContainer<Post>>> {
		throw new Error('Method not implemented.');
	}
}

describe('Post Router', () => {
	let mockAddTextPostUseCase: AddTextPostUseCase;
	let mockGetPostsUseCase: GetPostsUseCase;
	let mockUpdatePostUseCase: UpdatePostUseCase;
	let mockDeletePostUseCase: DeletePostUseCase;
	let mockChangeStagePostUseCase: ChangeStagePostUseCase;
	let mockEnablePostUseCase: EnablePostUseCase;
	let mockGetAdminViewPostUseCase: GetAdminViewPostsUseCase;
	let mockGetPostUseCase: GetPostUseCase;
	let mockAddMultiPostUseCase: AddMultiPostUseCase;
	let mockGetPostWithUserUseCase:MockGetPostWithUserUseCase;

	const UrlGetPost = '?orgaId=00000200-0200-0200-0200-000000000200&userId=00000005-0005-0005-0005-000000000005&flowId=00000111-0111-0111-0111-000000000111&stageId=00000AAA-0111-0111-0111-000000000111&boxPage=uploaded&searchText=post';

	const fakeGetPost: PostModel = new PostModel('00001AAA-0119-0111-0111-000000000000',
		[],'primer post del sistema','00000200-0200-0200-0200-000000000200','00000005-0005-0005-0005-000000000005',
		'00000111-0111-0111-0111-000000000111','00000AAA-0111-0111-0111-000000000111',true,true);

	const fakeAddTextPost = {
		orgaId:'00000200-0200-0200-0200-000000000200',
		userId:'00000005-0005-0005-0005-000000000005',
		flowId:'00000111-0111-0111-0111-000000000111',
		title:'cuarto post del sistema',
		textContent:'ok ok',
		draft:'false'
	};

	const fakeSendPost = {
		userId:'00000005-0005-0005-0005-000000000005',
		flowId:'00000111-0111-0111-0111-000000000111',
		stageId:'00000AAA-0111-0111-0111-000000000111',
		postId:'00001AAA-0119-0111-0111-000000000000',
		voteValue:'1'
	};

	const fakeUpdatePost = {
		userId:'00000005-0005-0005-0005-000000000005',
		postId:'00001AAA-0119-0111-0111-000000000000',
		title:'titulo editado',
		textContent:'contenido editado'
	};

	const fakeDeletePost = {
		userId:'00000005-0005-0005-0005-000000000005',
		postId:'00001AAA-0119-0111-0111-000000000000'
	};

	//carga de identificadores para las pruebas
	const testUserIdUser = data_insert01.users[4].id;
	const testUserIdRev1 = data_insert01.users[3].id;
	const testOrgaIdDefault = data_insert01.orgas[1].id;

	const testTokenUser = generateJWT({userId:testUserIdUser, orgaId: testOrgaIdDefault, roles: 'user'}, 'lomba', 60*60);
	const testTokenRev1 = generateJWT({userId:testUserIdRev1, orgaId: testOrgaIdDefault, roles: 'reviewer'}, 'lomba', 60*60);
	const testTokenAdmin = generateJWT({userId:testUserIdUser, orgaId: testOrgaIdDefault, roles: 'admin'}, 'lomba', 60*60);

	const listPosts: PostModel[] = [
		data_insert02.posts[0] as PostModel, data_insert02.posts[1] as PostModel
	];

	beforeAll(() => {
		mockAddTextPostUseCase = new MockAddTextPostUseCase();
		mockGetPostsUseCase = new MockGetPostsUseCase();
		mockUpdatePostUseCase = new MockUpdatePostUseCase();
		mockDeletePostUseCase = new MockDeletePostUseCase();
		mockEnablePostUseCase = new MockEnablePostUseCase();
		mockChangeStagePostUseCase = new MockChangeStagePostUseCase();
		mockGetAdminViewPostUseCase = new MockGetAdminViewPostUseCase();
		mockGetPostUseCase = new MockGetPostUseCase();
		mockAddMultiPostUseCase = new MockAddMultiPostUseCase();
		mockGetPostWithUserUseCase = new MockGetPostWithUserUseCase();

		server.use('/api/v1/post', PostsRouter(mockGetPostsUseCase, mockAddTextPostUseCase, mockUpdatePostUseCase, mockDeletePostUseCase, mockEnablePostUseCase, mockChangeStagePostUseCase, mockGetAdminViewPostUseCase, mockGetPostUseCase, mockAddMultiPostUseCase, mockGetPostWithUserUseCase));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('GET /post:id', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = listPosts[0];
			jest.spyOn(mockGetPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));

			//act
			const response = await request(server).get('/api/v1/post/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetPostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 404 no encontrado', async () => {
			//arrange
			jest.spyOn(mockGetPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer([]))));

			//act
			const response = await request(server).get('/api/v1/post/9999').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(404);
			expect(mockGetPostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeUndefined();
			expect(roures.error).toBeDefined();

		});

		/*
		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const expectedData = listPosts[0];
			jest.spyOn(mockGetPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));

			//act
			const response = await request(server).get('/api/v1/post/1');
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockGetPostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();

		});
		*/

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get('/api/v1/post/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetPostUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).get('/api/v1/post/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});


	//get de post
	describe('GET /post', () => {

		test('debe retornar 200 y sin datos', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get('/api/v1/post/box/').set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetPostsUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 200 y con sort y parámetros', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get('/api/v1/post/box/?sort=%5B%5B%22created%22,1%5D%5D&paramvars=%7B%22isdraft%22:false%7D&boxpage=uploaded&searchtext=&pageindex=1&pagesize=10').set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetPostsUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get(`/api/v1/post/box/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockGetPostsUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		/*
		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get(`/api/v1/post/box/${UrlGetPost}`);
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(401);
			expect(mockGetPostsUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeUndefined();
			expect(roures.error).toBeDefined();

		});
		*/

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).get(`/api/v1/post/box/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetPostsUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).get(`/api/v1/post/box/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			//asserts
			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

	});

	//post de usuarios
	describe('POST /post/', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(fakeGetPost))));

			//act
			const response = await request(server).post('/api/v1/post/').send(fakeAddTextPost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/post/').send(fakeAddTextPost);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 403 porque usuario no el role', async () => {
			//arrange
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/post/').send(fakeAddTextPost).set({Authorization: 'Bearer ' + testTokenRev1});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(403);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/post/').send(fakeAddTextPost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockAddTextPostUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/post/').send(fakeAddTextPost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockAddTextPostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	
	//post de usuarios
	/*
	describe('SendPost /post/vote/', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			//const inputData = fakeAddTextPost;
			jest.spyOn(mockSendVoteUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(fakeGetPost))));

			//act
			const response = await request(server).post('/api/v1/post/vote/').send(fakeSendPost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockSendVoteUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			jest.spyOn(mockSendVoteUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/post/vote/').send(fakeSendPost);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockSendVoteUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockSendVoteUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).post('/api/v1/post/vote/').send(fakeSendPost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockSendVoteUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockSendVoteUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).post('/api/v1/post/vote/').send(fakeSendPost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockSendVoteUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});
*/
	describe('UpdataPost /post/', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			//const inputData = fakeAddTextPost;
			jest.spyOn(mockUpdatePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(fakeGetPost))));

			//act
			const response = await request(server).put('/api/v1/post/multi/1').send(fakeUpdatePost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockUpdatePostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			jest.spyOn(mockUpdatePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/post/multi/1').send(fakeUpdatePost);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockUpdatePostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockUpdatePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/post/multi/1').send(fakeUpdatePost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdatePostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockUpdatePostUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/post/multi/1').send(fakeUpdatePost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockUpdatePostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//get admin view de post
	describe('GET /post/admin', () => {

		test('debe retornar 200 y sin datos', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockGetAdminViewPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get('/api/v1/post/admin/').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;
	
			//assert
			expect(response.status).toBe(200);
			expect(mockGetAdminViewPostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();
	
		});
	
		test('debe retornar 200 y con sort y parámetros', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockGetAdminViewPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get('/api/v1/post/admin/?sort=%5B%5B%22created%22,1%5D%5D&paramvars=%7B%22isdraft%22:false%7D&searchtext=&pageindex=1&pagesize=10').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;
	
			//assert
			expect(response.status).toBe(200);
			expect(mockGetAdminViewPostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();
	
		});
	
		test('debe retornar 200 y con datos', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockGetAdminViewPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get(`/api/v1/post/admin/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;
	
			//assert
			expect(response.status).toBe(200);
			expect(mockGetAdminViewPostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();
	
		});
	
			
		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockGetAdminViewPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
			//act
			const response = await request(server).get(`/api/v1/post/admin/${UrlGetPost}`);
			const roures = response.body as RouterResponse;
	
			//assert
			expect(response.status).toBe(401);
			expect(mockGetAdminViewPostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeUndefined();
			expect(roures.error).toBeDefined();
	
		});
			
	
		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockGetAdminViewPostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));
	
			//act
			const response = await request(server).get(`/api/v1/post/admin/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;
	
			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	
		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockGetAdminViewPostUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));
	
			//act
			const response = await request(server).get(`/api/v1/post/admin/${UrlGetPost}`).set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;
	
			//asserts
			expect(response.status).toBe(500);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	
	});


	//put de habilitación de post con id en ruta
	describe('PUT /post/enable/:id', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			jest.spyOn(mockEnablePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(true)));

			//act
			const response = await request(server).put('/api/v1/post/enable/1?enable=false').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;
			
			expect(response.status).toBe(200);
			expect(mockEnablePostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no identificado', async () => {
			//arrange
			jest.spyOn(mockEnablePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/post/enable/1?enable=true');
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockEnablePostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 403 porque usuario no tiene el role', async () => {
			//arrange
			jest.spyOn(mockEnablePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/post/enable/1?enable=true').set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(403);
			expect(mockEnablePostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});		

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockEnablePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/post/enable/1?enable=true').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockEnablePostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			jest.spyOn(mockEnablePostUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/post/enable/1?enable=false').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockEnablePostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	describe('DeletePost /post/', () => {

		test('debe retornar 200 y con datos', async () => {
			//arrange
			//const inputData = fakeAddTextPost;
			jest.spyOn(mockDeletePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(fakeGetPost))));

			//act
			const response = await request(server).delete('/api/v1/post/').send(fakeDeletePost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockDeletePostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.data?.items?.length).toEqual(1);
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 401 porque usuario no autenticado', async () => {
			//arrange
			jest.spyOn(mockDeletePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).delete('/api/v1/post/').send(fakeDeletePost);
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockDeletePostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de failure', async () => {
			//arrange
			jest.spyOn(mockDeletePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).delete('/api/v1/post/').send(fakeDeletePost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockDeletePostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
			//arrange
			jest.spyOn(mockDeletePostUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).delete('/api/v1/post/').send(fakeDeletePost).set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockDeletePostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});

	//put de cambio de etapa de post con id en ruta
	describe('PUT /post/stage/:id', () => {

		test('debe retornar 200 y con datos', async () => {
		//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockChangeStagePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));

			//act
			const response = await request(server).put('/api/v1/post/stage/1?flowId=1&stageId=2').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			//assert
			expect(response.status).toBe(200);
			expect(mockChangeStagePostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();

		});

		test('debe retornar 200 y sin datos', async () => {
			//arrange
			const expectedData = fakeGetPost;
			jest.spyOn(mockChangeStagePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(expectedData))));
	
			//act
			const response = await request(server).put('/api/v1/post/stage/1').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;
	
			//assert
			expect(response.status).toBe(200);
			expect(mockChangeStagePostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.data).toBeDefined();
			expect(roures.error).toBeUndefined();
	
		});

		test('debe retornar 401 porque usuario no identificado', async () => {
		//arrange
			jest.spyOn(mockChangeStagePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/post/stage/1?flowId=1&stageId=2');
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(401);
			expect(mockChangeStagePostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 403 porque usuario no tiene el role', async () => {
		//arrange
			jest.spyOn(mockChangeStagePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/post/stage/1?flowId=1&stageId=2').set({Authorization: 'Bearer ' + testTokenUser});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(403);
			expect(mockChangeStagePostUseCase.execute).toBeCalledTimes(0);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});		

		test('debe retornar 500 en caso de failure', async () => {
		//arrange
			jest.spyOn(mockChangeStagePostUseCase, 'execute').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

			//act
			const response = await request(server).put('/api/v1/post/stage/1?flowId=1&stageId=2').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockChangeStagePostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});

		test('debe retornar 500 en caso de error', async () => {
		//arrange
			jest.spyOn(mockChangeStagePostUseCase, 'execute').mockImplementation(() => Promise.reject(new Error('error message')));

			//act
			const response = await request(server).put('/api/v1/post/stage/1?flowId=1&stageId=2').set({Authorization: 'Bearer ' + testTokenAdmin});
			const roures = response.body as RouterResponse;

			expect(response.status).toBe(500);
			expect(mockChangeStagePostUseCase.execute).toBeCalledTimes(1);
			expect(response.body as RouterResponse).toBeDefined();
			expect(roures.error).toBeDefined();
			expect(roures.data).toBeUndefined();
		});
	});


});