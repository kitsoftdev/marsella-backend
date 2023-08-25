import { CategoryDataSource } from '../../data/datasources/category_data_source';
import { FlowDataSource } from '../../data/datasources/flow_data_source';
import { PostDataSource } from '../../data/datasources/post_data_source';
import { StageDataSource } from '../../data/datasources/stage_data_source';
import { VoteDataSource } from '../../data/datasources/vote_data_source';
import { CategoryModel } from '../../data/models/workflow/category_model';
import { FlowModel } from '../../data/models/workflow/flow_model';
import { PostModel } from '../../data/models/workflow/post_model';
import { StageModel } from '../../data/models/workflow/stage_model';
import { VoteModel } from '../../data/models/workflow/vote_model';
import { Category } from '../../domain/entities/workflow/category';
import { Flow } from '../../domain/entities/workflow/flow';
import { Post } from '../../domain/entities/workflow/post';
import { PostItem } from '../../domain/entities/workflow/postitem';
import { Stage } from '../../domain/entities/workflow/stage';
import { TextContent } from '../../domain/entities/workflow/textcontent';
import { Total } from '../../domain/entities/workflow/total';
import { Vote } from '../../domain/entities/workflow/vote';
import { MongoWrapper, NoSQLDatabaseWrapper } from '../wrappers/mongo_wrapper';
import { data_insert01 } from './load_data_01';

const flowId = '00000111-0111-0111-0111-000000000111';
const stageId01Load = '00000AAA-0111-0111-0111-000000000111';
const stageId02Approval = '00000BBB-0111-0111-0111-000000000111';
const stageId03Voting = '00000CCC-0111-0111-0111-000000000111';

const post01Id = '00001AAA-0119-0111-0111-000000000000';
const post02Id = '00002AAA-0119-0111-0111-000000000000';
const post03Id = '00003AAA-0119-0111-0111-000000000000';
const post04Id = '00004AAA-0119-0111-0111-000000000000';

const vote01Id = '00004CCC-0222-0222-0222-000000000222';


export const checkData02 = async (stageSource: StageDataSource, flowSource: FlowDataSource, postSource: PostDataSource, voteSource: VoteDataSource, categorySource: CategoryDataSource, postMongo: NoSQLDatabaseWrapper<PostModel>, categoryMongo: NoSQLDatabaseWrapper<CategoryModel>, voteMongo: NoSQLDatabaseWrapper<VoteModel>) => {

	data_insert02.flows[0].stages = data_insert02.stages;

	data_insert02.posts[0].postitems.push(data_insert02.postitems[0]);
	data_insert02.posts[1].postitems.push(data_insert02.postitems[1]);
	data_insert02.posts[2].postitems.push(data_insert02.postitems[2]);
	data_insert02.posts[3].postitems.push(data_insert02.postitems[3]);

	data_insert02.posts[0].stages.push(data_insert02.stages[0]);
	data_insert02.posts[1].stages.push(data_insert02.stages[0]);
	data_insert02.posts[2].stages.push(data_insert02.stages[0]);
	data_insert02.posts[3].stages.push(data_insert02.stages[0]);
	data_insert02.posts[3].stages.push(data_insert02.stages[1]);

	data_insert02.posts[3].totals.push(data_insert02.totals[0]);
	//data_insert02.posts[3].votes.push(data_insert02.votes[0]);
	
	//const listCollections = (await postMongo.db.listCollections().toArray());
	
	///buscar si existe stage cada uno
	//stages
	data_insert02.stages.forEach(async stage => {
		const result = await stageSource.getOne({_id:stage.id});
		if(result.currentItemCount < 1)
		{
			await stageSource.add(new StageModel(stage.id, stage.name, stage.order, stage.queryOut, stage.enabled, stage.builtIn));
		}
	});

	///buscar si existe flow cada uno	
	//flows
	data_insert02.flows.forEach(async flow => {
		const result = await flowSource.getOne({_id:flow.id});
		if(result.currentItemCount < 1)
		{
			const resultAdd = await flowSource.add(new FlowModel(flow.id, flow.name, [], flow.enabled, flow.builtIn));

			flow.stages.forEach(async stage => {
				await flowSource.updateDirect(resultAdd.items[0].id, {$push : {stages: stage}});
			});
		}
	});

	///buscar si existe flow cada uno	
	//flows
	data_insert02.categories.forEach(async category => {
		const result = await categorySource.getByName(category.name);
		if(result.currentItemCount < 1)
		{
			await categorySource.add(new CategoryModel('', category.name, category.longname, category.lowercase, '', category.description, [], category.enabled, category.builtIn));
		}
	});

	///insertar posts
	data_insert02.posts.forEach(async post => {
		const result = await postSource.getByIdBasic(post.id); 
		if(result.currentItemCount < 1)
		{
			const resultAdd = await postSource.add(new PostModel(post.id, [], post.title, post.orgaId, post.userId, post.flowId, post.stageId, post.enabled, post.builtIn));

			post.postitems.forEach(async postitem => {
				await postSource.pushToArrayField(resultAdd.items[0].id,  {postitems: postitem});
			});
			
			post.stages.forEach(async stage => {
				await postSource.pushToArrayField(resultAdd.items[0].id,  {stages: stage});
			});		
			
			post.totals.forEach(async total => {
				await postSource.pushToArrayField(resultAdd.items[0].id,  {totals: total});
			});	

			post.categoryNames.forEach(async categoryName => {
				await postSource.pushToArrayField(resultAdd.items[0].id,  {categoryNames: categoryName});
			});				
				
		}
	});

	data_insert02.votes.forEach(async vote => {
		const result = await voteSource.getOne({_id:vote.id});
		if(result.currentItemCount < 1)
		{
			await voteSource.add(new VoteModel(vote01Id, vote.userId, vote.postId, vote.flowId, vote.stageId, vote.key, vote.value, true, true));
		}
	});


	try{

		const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
		await sleep(1500).then(async () => {
			if(!await postMongo.db.collection(postMongo.collectionName).indexExists('ix_post_id'))
			{
				postMongo.db.collection(postMongo.collectionName).createIndex(
					{
						'id': 1,
					},{
						name: 'ix_post_id'
					}
				);
			}
			if(!await postMongo.db.collection(postMongo.collectionName).indexExists('ix_post_title_postitem_content_categoryNames_text'))
			{
				postMongo.db.collection(postMongo.collectionName).createIndex(
					{
						'title': 'text',
						'postitems.content.text': 'text',
						'categoryNames': 'text',
					},{
						name: 'ix_post_title_postitem_content_categoryNames_text'
					}
				);
			}
			if(!await postMongo.db.collection(postMongo.collectionName).indexExists('ix_post_userId'))
			{
				postMongo.db.collection(postMongo.collectionName).createIndex(
					{
						'userId': 1,
					},{
						name: 'ix_post_userId'
					}
				);
			}
			if(!await postMongo.db.collection(postMongo.collectionName).indexExists('ix_post_flowId_stageId'))
			{
				postMongo.db.collection(postMongo.collectionName).createIndex(
					{
						'flowId': 1,
						'stageId': 1,
					},{
						name: 'ix_post_flowId_stageId'
					}
				);
			}
			if(!await postMongo.db.collection(postMongo.collectionName).indexExists('ix_post_userId_orgaId_flowId_stageId'))
			{
				postMongo.db.collection(postMongo.collectionName).createIndex(
					{
						'userId': 1,
						'orgaId': 1,
						'flowId': 1,
						'stageId': 1,
					},{
						name: 'ix_post_userId_orgaId_flowId_stageId'
					}
				);
			}
			if(!await postMongo.db.collection(postMongo.collectionName).indexExists('ix_post_userId_postId_flowId_stageId'))
			{
				postMongo.db.collection(postMongo.collectionName).createIndex(
					{
						'userId': 1,
						'postId': 1,
						'flowId': 1,
						'stageId': 1,
					},{
						name: 'ix_post_userId_postId_flowId_stageId'
					}
				);
			}
			if(!await postMongo.db.collection(postMongo.collectionName).indexExists('ix_post_categoryNames_orgaId_flowId_stageId'))
			{
				postMongo.db.collection(postMongo.collectionName).createIndex(
					{
						'categoryNames': 1,
						'orgaId': 1,
						'flowId': 1,
						'stageId': 1,
					},{
						name: 'ix_post_categoryNames_orgaId_flowId_stageId'
					}
				);
			}
			if(!await postMongo.db.collection(postMongo.collectionName).indexExists('ix_post_totals_totalcount_flowId_stageId'))
			{
				postMongo.db.collection(postMongo.collectionName).createIndex(
					{
						'totals.totalcount': 1,
						'totals.flowId': 1,
						'totals.stageId': 1,
					},{
						name: 'ix_post_totals_totalcount_flowId_stageId'
					}
				);
			}
			if(!await postMongo.db.collection(postMongo.collectionName).indexExists('ix_post_enabled'))
			{
				postMongo.db.collection(postMongo.collectionName).createIndex(
					{
						'enabled': 1
					},{
						name: 'ix_post_enabled'
					}
				);
			}
			if(!await categoryMongo.db.collection(categoryMongo.collectionName).indexExists('ix_category_id'))
			{
				categoryMongo.db.collection(categoryMongo.collectionName).createIndex(
					{
						'id': 1,
					},{
						name: 'ix_category_id'
					}
				);
			}
			if(!await categoryMongo.db.collection(categoryMongo.collectionName).indexExists('ix_category_name_longname_lowercase_description'))
			{
				categoryMongo.db.collection(categoryMongo.collectionName).createIndex(
					{
						'name': 'text',
						'longname': 'text',
						'lowercase': 'text',
						'description': 'text'
					},{
						name: 'ix_category_name_longname_lowercase_description'
					}
				);
			}
			if(!await voteMongo.db.collection(voteMongo.collectionName).indexExists('ix_vote_userId'))
			{
				voteMongo.db.collection(voteMongo.collectionName).createIndex(
					{
						'userId': 1,
					},{
						name: 'ix_vote_userId'
					}
				);
			}
			if(!await voteMongo.db.collection(voteMongo.collectionName).indexExists('ix_vote_userId_postId'))
			{
				voteMongo.db.collection(voteMongo.collectionName).createIndex(
					{
						'userId': 1,
						'postId': 1,
					},{
						name: 'ix_vote_userId_postId'
					}
				);
			}
			if(!await voteMongo.db.collection(voteMongo.collectionName).indexExists('ix_vote_userId_postId_flowId_stageId'))
			{
				voteMongo.db.collection(voteMongo.collectionName).createIndex(
					{
						'userId': 1,
						'postId': 1,
						'flowId': 1,
						'stageId': 1,
					},{
						name: 'ix_vote_userId_postId_flowId_stageId'
					}
				);
			}
			if(!await voteMongo.db.collection(voteMongo.collectionName).indexExists('ix_vote_postId_flowId_stageId'))
			{
				voteMongo.db.collection(voteMongo.collectionName).createIndex(
					{
						'postId': 1,
						'flowId': 1,
						'stageId': 1,
					},{
						name: 'ix_vote_postId_flowId_stageId'
					}
				);
			}
		
		});
	}catch(e){
		console.log('no index');
		console.log(e);
	}
	

};

export const data_insert02 = {

	stages:[{name: 'Carga', order:1, queryOut: {'totals.totalpositive' : {$gte: 1}, 'totals.stageId' : stageId01Load, 'stageId' :stageId01Load, 'flowId' : flowId},
		_id:stageId01Load, id:stageId01Load, enabled:true, builtIn:true, created: new Date()} as Stage,
        {name: 'Aprobación', order:2, queryOut: {'totals.totalpositive': { $gte: 2}, 'totals.totalcount' : {$gte: 2}, 'totals.stageId' : stageId02Approval},_id:stageId02Approval, id:stageId02Approval, enabled:true, builtIn:true, created: new Date()} as Stage,{name: 'Votación', order:3, queryOut: undefined,_id:stageId03Voting, id:stageId03Voting, enabled:true, builtIn:true, created: new Date()} as Stage],

	flows:[{name: 'Flujo de Votación', stages:[], _id:flowId, id:flowId, enabled:true, builtIn:true, created: new Date()} as Flow],

	postitems:[{order:1, content: {text:'texto de un post!'} as TextContent, type:'text', format:'', builtIn:true, created: new Date()} as PostItem, {order:1, content: {text:'esto es otro post'} as TextContent, type:'text', format:'', builtIn:true, created: new Date()} as PostItem, {order:1, content: {text:'se trata del tercer post'} as TextContent, type:'text', format:'', builtIn:true, created: new Date()} as PostItem, {order:1, content: {text:'un cuarto post'} as TextContent, type:'text', format:'', builtIn:true, created: new Date()} as PostItem],
    
	posts:[{postitems:[], title:'primer post del sistema', orgaId: data_insert01.orgas[1].id, userId: data_insert01.users[4].id, flowId:flowId, stageId: stageId01Load, stages:[], totals:[], tracks:[], votes:[], bookmarks:[], comments:[], categoryNames:['humor'], categories:[], users:[], _id:post01Id, id:post01Id, enabled:true, builtIn:true, created: new Date(), totalfavs:0, totalsaves:0, totalreports:0, totalcomments:0, totaldownloads:0} as Post, {postitems:[], title:'este es el segundo post', orgaId: data_insert01.orgas[1].id, userId: data_insert01.users[4].id, flowId:flowId, stageId: stageId01Load, stages:[], totals:[], tracks:[], votes:[], bookmarks:[], comments:[], categoryNames:[], categories:[], users:[], _id:post02Id, id:post02Id, enabled:true, builtIn:true, created: new Date(), totalfavs:0, totalsaves:0, totalreports:0, totalcomments:0, totaldownloads:0} as Post, {postitems:[], title:'tercer post en fila', orgaId: data_insert01.orgas[1].id, userId: data_insert01.users[5].id, flowId:flowId, stageId: stageId01Load, stages:[], totals:[], tracks:[], votes:[], bookmarks:[], comments:[], categoryNames:[], categories:[], users:[], _id:post03Id, id:post03Id, enabled:true, builtIn:true, created: new Date(), totalfavs:0, totalsaves:0, totalreports:0, totalcomments:0, totaldownloads:0} as Post, {postitems:[], title:'cuarto post nacido en etapa 2', orgaId: data_insert01.orgas[1].id, userId: data_insert01.users[5].id, flowId:flowId, stageId: stageId02Approval, stages:[], totals:[], tracks:[], votes:[], bookmarks:[], comments:[], categoryNames:[], categories:[], users:[], _id:post04Id, id:post04Id, enabled:true, builtIn:true, created: new Date(), totalfavs:0, totalsaves:0, totalreports:0, totalcomments:0, totaldownloads:0} as Post],

	votes:[{  
		id: vote01Id,
		postId:post04Id,
		flowId:flowId,
		stageId:stageId01Load,
		userId:data_insert01.users[5].id,
		key: `${data_insert01.users[5].id}-${stageId01Load}-${flowId}`,
		value:1, created: new Date()} as Vote],

	totals:[{totalpositive: 1,
		totalnegative: 0,
		totalcount: 1,  
		flowId:flowId,
		stageId:stageId01Load} as Total],

	categories:[{
		name: 'humor',longname:'humor',lowercase:'humor',description:'humor', created: new Date()} as Category
	],

};