import { PostModel } from '../../../../src/data/models/workflow/post_model';
import { Post } from '../../../../src/domain/entities/workflow/post';


describe('Test de post model', () => {

	const listPosts: PostModel[] = [
		new PostModel('idpost', [], 'título', 'orgaId', 'userId', 'flowId', 'stageId', true, false)
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('convertir a entidad', () => {
		//arrange
		const model = listPosts[0];
		const entity = { _id:model.id,id: model.id, postitems: [], title: model.title, orgaId: model.orgaId, userId: model.userId, flowId: model.flowId, stageId: model.stageId, enabled: true, builtIn: false, deleted: undefined, expires: undefined, stages:[], totals:[], tracks:[], updated: undefined, votes:[], bookmarks:[], categories:[], categoryNames:[], totalcomments:0, totaldownloads:0, totalfavs:0, totalreports:0, totalsaves:0, users:[], comments:[] } as unknown as Post;

		entity.created = model.created;

		//act
		const result = model.toEntity();

		//assert
		expect(result).toEqual(entity);
	});

});