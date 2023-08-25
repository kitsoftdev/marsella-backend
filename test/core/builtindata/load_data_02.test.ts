import { Collection, Db } from 'mongodb';
import { checkData02, data_insert02 } from '../../../src/core/builtindata/load_data_02';
import { ModelContainer } from '../../../src/core/model_container';
import { MongoWrapper, NoSQLDatabaseWrapper } from '../../../src/core/wrappers/mongo_wrapper';
import { FlowDataSource } from '../../../src/data/datasources/flow_data_source';
import { PostDataSource } from '../../../src/data/datasources/post_data_source';
import { StageDataSource } from '../../../src/data/datasources/stage_data_source';
import { FlowModel } from '../../../src/data/models/workflow/flow_model';
import { PostModel } from '../../../src/data/models/workflow/post_model';
import { StageModel } from '../../../src/data/models/workflow/stage_model';
import { CategoryModel } from '../../../src/data/models/workflow/category_model';
import { VoteModel } from '../../../src/data/models/workflow/vote_model';
import { VoteDataSource } from '../../../src/data/datasources/vote_data_source';
import { CategoryDataSource } from '../../../src/data/datasources/category_data_source';

class MockStageDataSource implements StageDataSource {
	getMany(): Promise<ModelContainer<StageModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<StageModel>> {
		throw new Error('Method not implemented.');
	}
	add(): Promise<ModelContainer<StageModel>> {
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<StageModel>> {
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	setId(): StageModel {
		throw new Error('Method not implemented.');
	}
	getAll(): Promise<ModelContainer<StageModel>> {
		throw new Error('Method not implemented.');
	}
	getById(): Promise<ModelContainer<StageModel>> {
		throw new Error('Method not implemented.');
	}
}
class MockFlowDataSource implements FlowDataSource {
	getMany(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
	add(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	setId(): FlowModel {
		throw new Error('Method not implemented.');
	}
	updateDirect(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
	getAll(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
	getById(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
}
class MockPostDataSource implements PostDataSource {
	getManyComplete(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getOneComplete(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getByIdBasic(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getByIdWithUser(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	updateBookmarksTotals(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	getFavedPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getSavedPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	addTrack(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	getMany(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getManyWithOptions(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getOneWithOptions(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	add(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	setId(): PostModel {
		throw new Error('Method not implemented.');
	}
	updateDirect(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	updateArray(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	get dbcollection(): MongoWrapper<PostModel> {
		throw new Error('Method not implemented.');
	}
	getUploadedPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getForApprovePosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getApprovedPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getRejectedPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getLatestPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getPopularPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getVotedPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getAdminViewPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getIfHasVote(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getById(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getByQueryOut(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	pushToArrayField(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	updateTotals(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	updateVote(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
}

class MockCategoryDataSource implements CategoryDataSource{
	setId(): CategoryModel {
		throw new Error('Method not implemented.');
	}
	add(): Promise<ModelContainer<CategoryModel>> {
		throw new Error('Method not implemented.');
	}
	getById(): Promise<ModelContainer<CategoryModel>> {
		throw new Error('Method not implemented.');
	}
	getByName(): Promise<ModelContainer<CategoryModel>> {
		throw new Error('Method not implemented.');
	}
	searchCategory(): Promise<ModelContainer<CategoryModel>> {
		throw new Error('Method not implemented.');
	}
	
}

class MockVoteDataSource implements VoteDataSource {
	getMany(): Promise<ModelContainer<VoteModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<VoteModel>> {
		throw new Error('Method not implemented.');
	}
	add(): Promise<ModelContainer<VoteModel>> {
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<VoteModel>> {
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	setId(): VoteModel {
		throw new Error('Method not implemented.');
	}
	getById(): Promise<ModelContainer<VoteModel>> {
		throw new Error('Method not implemented.');
	}
	getByPost(): Promise<ModelContainer<VoteModel>> {
		throw new Error('Method not implemented.');
	}
	getVote(): Promise<ModelContainer<VoteModel>> {
		throw new Error('Method not implemented.');
	}
}

class MockWrapper<T> implements NoSQLDatabaseWrapper<T> {
	getMany(): Promise<ModelContainer<T>> {
		throw new Error('Method not implemented.');
	}
	getManyWithOptions(): Promise<ModelContainer<T>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<T>> {
		throw new Error('Method not implemented.');
	}
	getOneWithOptions(): Promise<ModelContainer<T>> {
		throw new Error('Method not implemented.');
	}
	add(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	update(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	updateDirect(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	updateArray(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	updateDirectByQuery(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	collectionName:string;
	db:Db;
	constructor(collectionName: string, dbMongo: Db){
		this.collectionName = collectionName;
		this.db = dbMongo;
	}
	upsert(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
}


describe('Test del load data 01', () => {

	let mockStageDataSource: MockStageDataSource;
	let mockFlowDataSource: MockFlowDataSource;
	let mockPostDataSource: MockPostDataSource;
	let mockVoteDataSource:MockVoteDataSource;
	let mockCategoryDataSource:MockCategoryDataSource;
	let mockWrapperPost: MockWrapper<PostModel>;
	let mockWrapperCategory: MockWrapper<CategoryModel>;
	let mockWrapperVote: MockWrapper<VoteModel>;

	beforeEach(() => {
		jest.clearAllMocks();
		mockStageDataSource = new MockStageDataSource();
		mockFlowDataSource = new MockFlowDataSource();
		mockPostDataSource = new MockPostDataSource();
		mockVoteDataSource = new MockVoteDataSource();
		mockCategoryDataSource = new MockCategoryDataSource();
		mockWrapperPost = new MockWrapper('posts', (jest.fn() as unknown) as Db);
		mockWrapperCategory = new MockWrapper('categories', (jest.fn() as unknown) as Db);
		mockWrapperVote = new MockWrapper('votes', (jest.fn() as unknown) as Db);
	});

	const testRoleName = 'admin';
	const testStages = data_insert02.stages;
	const testFlows = data_insert02.flows;
	const testPostItems = data_insert02.postitems;
	const testPosts = data_insert02.posts;
	const testVotes = data_insert02.votes;
	const testCategories = data_insert02.categories;
	const testTotals = data_insert02.totals;

	test('Revisión de etapas', () => {
		//arrange
		const stages = data_insert02.stages;
		//act

		//assert
		expect(stages.length).toEqual(3);
	});

	test('Revisión de flujos', () => {
		//arrange
		const flows = data_insert02.flows;
		//act
		const len = flows.length;
		//assert
		expect(len).toEqual(1);
		
	});

	test('Revisión de postitems', () => {
		//arrange
		const postitems = data_insert02.postitems;
		//act
		const len = postitems.length;

		//assert
		expect(len).toEqual(4);
		
	});

	test('Revisión de post', () => {
		//arrange
		const posts = data_insert02.posts;
		
		//act
		const len = posts.length;
		
        
		//assert
		expect(len).toEqual(4);
		
	});

	test('Revisión de votos', () => {
		//arrange
		const votes = data_insert02.votes;
		
		//act
		const len = votes.length;
		
        
		//assert
		expect(len).toEqual(1);
		
	});

	test('Revisión de totales', () => {
		//arrange
		const totals = data_insert02.totals;
		
		//act
		const len = totals.length;
		
        
		//assert
		expect(len).toEqual(1);
		
	});    

	test('debe agregar flujos, etapas y posts', async () => {
		//arrange

		const model_con_stage = ModelContainer.fromOneItem(new StageModel(testStages[0].id, testStages[0].name, testStages[0].order, testStages[0].queryOut, testStages[0].enabled, testStages[0].builtIn));
		const model_void_stage = new ModelContainer<StageModel>([]);

		const model_con_vote = ModelContainer.fromOneItem(new VoteModel(testVotes[0].id, testVotes[0].userId, testVotes[0].postId, testVotes[0].flowId, testVotes[0].stageId, testVotes[0].key, testVotes[0].value, testVotes[0].enabled, testVotes[0].builtIn));
		const model_void_vote = new ModelContainer<VoteModel>([]);

		const model_con_flow = ModelContainer.fromOneItem(new FlowModel(testFlows[0].id, testFlows[0].name, [], testFlows[0].enabled, testFlows[0].builtIn));

		const model_void_flow = new ModelContainer<FlowModel>([]);

		const model_con_post = ModelContainer.fromOneItem(new PostModel(testPosts[0].id, [], testPosts[0].title, testPosts[0].orgaId, testPosts[0].userId, testPosts[0].flowId, testPosts[0].stageId, testPosts[0].enabled, testPosts[0].builtIn));

		const model_void_post = new ModelContainer<PostModel>([]);

		const model_con_category = ModelContainer.fromOneItem(new CategoryModel('', testCategories[0].name, testCategories[0].longname, testCategories[0].lowercase, '', testCategories[0].description, [], testCategories[0].enabled, testCategories[0].builtIn));
		const model_void_category = new ModelContainer<CategoryModel>([]);



		jest.spyOn(mockStageDataSource, 'getOne').mockImplementation(() => Promise.resolve(model_void_stage));

		jest.spyOn(mockStageDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_stage));

		jest.spyOn(mockFlowDataSource, 'getOne').mockImplementation(() => Promise.resolve(model_void_flow));

		jest.spyOn(mockFlowDataSource, 'add').mockImplementation(() => Promise.
			resolve(model_con_flow));

		jest.spyOn(mockFlowDataSource, 'updateDirect').mockImplementation(() => Promise.resolve(model_con_flow));        

		jest.spyOn(mockPostDataSource, 'getByIdBasic').mockImplementation(() => Promise.resolve(model_void_post));			

		jest.spyOn(mockPostDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_post));

		jest.spyOn(mockPostDataSource, 'pushToArrayField').mockImplementation(() => Promise.resolve(model_con_post));
		
		jest.spyOn(mockVoteDataSource, 'getOne').mockImplementation(() => Promise.resolve(model_void_vote));

		jest.spyOn(mockVoteDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_vote));

		jest.spyOn(mockCategoryDataSource, 'getByName').mockImplementation(() => Promise.resolve(model_void_category));

		jest.spyOn(mockCategoryDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_category));

		//jest.spyOn(mockWrapper.db.collection, 'createIndex');

		await checkData02(mockStageDataSource, mockFlowDataSource, mockPostDataSource, mockVoteDataSource, mockCategoryDataSource, mockWrapperPost, mockWrapperCategory, mockWrapperVote);

		expect(mockStageDataSource.getOne).toBeCalledTimes(3);
		expect(mockStageDataSource.add).toBeCalledTimes(3);


		expect(mockFlowDataSource.getOne).toBeCalledTimes(1);
		expect(mockFlowDataSource.add).toBeCalledTimes(1);
		expect(mockFlowDataSource.updateDirect).toBeCalledTimes(3);

		expect(mockPostDataSource.getByIdBasic).toBeCalledTimes(4);
		expect(mockPostDataSource.add).toBeCalledTimes(4);
		expect(mockPostDataSource.pushToArrayField).toBeCalledTimes(11);

	});
 

});