import { UserDataSource } from '../../data/datasources/user_data_source';
import { UserModel } from '../../data/models/user_model';
import { NoSQLDatabaseWrapper } from '../wrappers/mongo_wrapper';

export const checkData01 = async (userSource: UserDataSource, userMongo: NoSQLDatabaseWrapper<UserModel>,) => {

	//usuarios y password
	data_insert01.users.forEach(async user => {
		const result = await userSource.getOne({'_id':user.id});
		if(result.currentItemCount < 1)
		{
			//filtra los orgauser del usuario y se queda solo con el orgaId
			//const orgasu = data_insert01.orgausers.filter(ou=> ou.userId == user.id).map(o => o.orgaId);

			//luego obtiene todos los {id, code} de orgas solo de las
			//orgas cargadas previamente en orgasu (arriba)
			//const orgasidcodes = data_insert01.orgas.filter(o=> orgasu.includes(o.id)).map(co => {return {id:co.id, code:co.code};});

			const newUser = new UserModel(user.id, user.name, user.username, user.email, user.enabled, user.builtIn);

			//consigue el nuevo usuario insertado para modificarlo
			const insertedUser = await userSource.add(newUser);

			//actualiza el campo de orgas del usuario con {id, code}
			await userSource.update(insertedUser.items[0].id, {/*orgas:orgasidcodes*/});
			
			/*await passSource.delete(user.id);
			const hashPass = HashPassword.createHash(user.password);
			await passSource.add(new PasswordModel(user.id, hashPass.hash, hashPass.salt, true, user.builtIn));*/
		}
	});

	try{

		const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
		await sleep(1500);
		if(!await userMongo.db.collection(userMongo.collectionName).indexExists('ix_user_name_username_email_text'))
		{
			userMongo.db.collection(userMongo.collectionName).createIndex(
				{
					'name': 'text',
					'username': 'text',
					'email': 'text'
				},{
					name: 'ix_user_name_username_email_text'
				}
			);
		}
		if(!await userMongo.db.collection(userMongo.collectionName).indexExists('ix_user_id'))
		{
			userMongo.db.collection(userMongo.collectionName).createIndex(
				{
					'id': 1,
				},{
					name: 'ix_user_id'
				}
			);
		}
		if(!await userMongo.db.collection(userMongo.collectionName).indexExists('ix_user_username_email_enabled'))
		{
			userMongo.db.collection(userMongo.collectionName).createIndex(
				{
					'username': 1,
					'email': 1,
					'enabled': 1,
				},{
					name: 'ix_user_username_email_enabled'
				}
			);
		}
		if(!await userMongo.db.collection(userMongo.collectionName).indexExists('ix_user_orga_id'))
		{
			userMongo.db.collection(userMongo.collectionName).createIndex(
				{
					'orgas.id': 1,
				},{
					name: 'ix_user_orga_id'
				}
			);
		}
		if(!await userMongo.db.collection(userMongo.collectionName).indexExists('ix_user_created'))
		{
			userMongo.db.collection(userMongo.collectionName).createIndex(
				{
					'created': -1,
				},{
					name: 'ix_user_created'
				}
			);
		}

	}catch(e){
		console.log('no user index');
	}

};

export const data_insert01 = {
	roles:[
		{name : 'super','enabled':true},
		{name : 'admin','enabled':true},
		{name : 'reviewer','enabled':true},
		{name : 'user','enabled':true},
		{name : 'anonymous','enabled':true}
	],
	users:[
		{id:'00000001-0001-0001-0001-000000000001', name:'Súper', username:'super', email:'super@mp.com', builtIn:true, 'enabled':true, password: '1234'},
		{id:'00000002-0002-0002-0002-000000000002', name:'Admin', username:'admin', email:'admin@mp.com', builtIn:true, 'enabled':true, password: '1234'},
		{id:'00000003-0003-0003-0003-000000000003', name:'Reviewer 1', username:'rev1', email:'rev1@mp.com', builtIn:false, 'enabled':true, password: '1234'},
		{id:'00000004-0004-0004-0004-000000000004', name:'Reviewer 2', username:'rev2', email:'rev2@mp.com', builtIn:false, 'enabled':false, password: '1234'},        
		{id:'00000005-0005-0005-0005-000000000005', name:'User 1', username:'user1', email:'user1@mp.com', builtIn:false, 'enabled':true, password: '1234'},
		{id:'00000006-0006-0006-0006-000000000006', name:'User 2', username:'user2', email:'user2@mp.com', builtIn:false, 'enabled':true, password: '1234'},
		{id:'00000007-0007-0007-0007-000000000007', name:'User 3', username:'user3', email:'user3@mp.com', builtIn:false, 'enabled':false, password: '1234'}
	],
	orgas:[
		{id:'00000100-0100-0100-0100-000000000100', name:'System', code:'sys', builtIn:true, 'enabled':true},
		{id:'00000200-0200-0200-0200-000000000200', name:'Default', code:'def', builtIn:true, 'enabled':true}
	],
	orgausers: [
		{id:'A0000001-0000-0000-1000-000000000000', orgaId:'00000100-0100-0100-0100-000000000100', userId:'00000001-0001-0001-0001-000000000001', roles:['super'], builtIn:true},
		{id:'A0000002-0000-0000-1000-000000000000', orgaId:'00000200-0200-0200-0200-000000000200', userId:'00000002-0002-0002-0002-000000000002', roles:['admin'], builtIn:true},
		{id:'A0000003-0000-0000-1000-000000000000', orgaId:'00000200-0200-0200-0200-000000000200', userId:'00000003-0003-0003-0003-000000000003', roles:['reviewer'], builtIn:false},
		{id:'A0000004-0000-0000-1000-000000000000', orgaId:'00000200-0200-0200-0200-000000000200', userId:'00000004-0004-0004-0004-000000000004', roles:['reviewer'], builtIn:false},
		{id:'A0000005-0000-0000-1000-000000000000', orgaId:'00000200-0200-0200-0200-000000000200', userId:'00000005-0005-0005-0005-000000000005', roles:['user'], builtIn:false},
		{id:'A0000006-0000-0000-1000-000000000000', orgaId:'00000200-0200-0200-0200-000000000200', userId:'00000006-0006-0006-0006-000000000006', roles:['user'], builtIn:false},
		{id:'A0000007-0000-0000-1000-000000000000', orgaId:'00000200-0200-0200-0200-000000000200', userId:'00000007-0007-0007-0007-000000000007', roles:['user'], builtIn:false}
	]
};