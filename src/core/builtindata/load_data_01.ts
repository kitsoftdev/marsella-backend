import { OrgaDataSource } from '../../data/datasources/orga_data_source';
import { OrgaUserDataSource } from '../../data/datasources/orgauser_data_source';
import { PasswordDataSource } from '../../data/datasources/password_data_source';
import { RoleDataSource } from '../../data/datasources/role_data_source';
import { UserDataSource } from '../../data/datasources/user_data_source';
import { OrgaModel } from '../../data/models/orga_model';
import { OrgaUserModel } from '../../data/models/orgauser_model';
import { PasswordModel } from '../../data/models/password_model';
import { RoleModel } from '../../data/models/role_model';
import { UserModel } from '../../data/models/user_model';
import { HashPassword } from '../password_hash';
import { NoSQLDatabaseWrapper } from '../wrappers/mongo_wrapper';

export const checkData01 = async (roleSource: RoleDataSource, userSource: UserDataSource, passSource: PasswordDataSource, orgaSource: OrgaDataSource, orgaUserSource: OrgaUserDataSource, userMongo: NoSQLDatabaseWrapper<UserModel>, roleMongo: NoSQLDatabaseWrapper<RoleModel>, passMongo:NoSQLDatabaseWrapper<PasswordModel>, orgaMongo: NoSQLDatabaseWrapper<OrgaModel>, orgaUserMongo: NoSQLDatabaseWrapper<OrgaUserModel>) => {
	
	//roles
	data_insert01.roles.forEach(async role => {
		const result = await roleSource.getOne({'name':role.name});
		if(result.currentItemCount < 1)
		{
			await roleSource.add(new RoleModel(role.name, role.enabled));
		}
	});

	//usuarios y password
	data_insert01.users.forEach(async user => {
		const result = await userSource.getOne({'_id':user.id});
		if(result.currentItemCount < 1)
		{
			//filtra los orgauser del usuario y se queda solo con el orgaId
			const orgasu = data_insert01.orgausers.filter(ou=> ou.userId == user.id).map(o => o.orgaId);

			//luego obtiene todos los {id, code} de orgas solo de las
			//orgas cargadas previamente en orgasu (arriba)
			const orgasidcodes = data_insert01.orgas.filter(o=> orgasu.includes(o.id)).map(co => {return {id:co.id, code:co.code};});

			const newUser = new UserModel(user.id, user.name, user.username, user.email, user.enabled, user.builtIn);

			//consigue el nuevo usuario insertado para modificarlo
			const insertedUser = await userSource.add(newUser);

			//actualiza el campo de orgas del usuario con {id, code}
			await userSource.update(insertedUser.items[0].id, {orgas:orgasidcodes});
			
			await passSource.delete(user.id);
			const hashPass = HashPassword.createHash(user.password);
			await passSource.add(new PasswordModel(user.id, hashPass.hash, hashPass.salt, true, user.builtIn));
		}
	});
	
	//organizaciones
	data_insert01.orgas.forEach(async orga => {
		const result = await orgaSource.getOne({'_id':orga.id});
		if(result.currentItemCount < 1)
		{
			await orgaSource.add(orga as OrgaModel);
		}
	});

	//orgauser relación de organizaciones con usuarios
	data_insert01.orgausers.forEach(async orgaUser => {
		const result = await orgaUserSource.getOne({'_id':orgaUser.id});
		if(result.currentItemCount < 1)
		{
			const ou = new OrgaUserModel(orgaUser.orgaId, orgaUser.userId, orgaUser.roles.map(r=> new RoleModel(r, true).toEntity()), true, orgaUser.builtIn);
			ou.id = orgaUser.id;
			ou._id = orgaUser.id;
			await orgaUserSource.add(ou);
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
		if(!await roleMongo.db.collection(roleMongo.collectionName).indexExists('ix_role_id'))
		{
			roleMongo.db.collection(roleMongo.collectionName).createIndex(
				{
					'id': 1,
				},{
					name: 'ix_role_id'
				}
			);
		}
		if(!await roleMongo.db.collection(roleMongo.collectionName).indexExists('ix_role_name'))
		{
			roleMongo.db.collection(roleMongo.collectionName).createIndex(
				{
					'name': 1,
				},{
					name: 'ix_role_name'
				}
			);
		}
		if(!await passMongo.db.collection(passMongo.collectionName).indexExists('ix_pass_id'))
		{
			passMongo.db.collection(passMongo.collectionName).createIndex(
				{
					'id': 1,
				},{
					name: 'ix_pass_id'
				}
			);
		}
		if(!await passMongo.db.collection(passMongo.collectionName).indexExists('ix_pass_userId'))
		{
			passMongo.db.collection(passMongo.collectionName).createIndex(
				{
					'userId': 1,
				},{
					name: 'ix_pass_userId'
				}
			);
		}
		if(!await passMongo.db.collection(passMongo.collectionName).indexExists('ix_pass_userId_enabled'))
		{
			passMongo.db.collection(passMongo.collectionName).createIndex(
				{
					'userId': 1,
					'enabled': 1,
				},{
					name: 'ix_pass_userId_enabled'
				}
			);
		}
		if(!await orgaMongo.db.collection(orgaMongo.collectionName).indexExists('ix_orga_id'))
		{
			orgaMongo.db.collection(orgaMongo.collectionName).createIndex(
				{
					'id': 1,
				},{
					name: 'ix_orga_id'
				}
			);
		}
		if(!await orgaMongo.db.collection(orgaMongo.collectionName).indexExists('ix_orga_code'))
		{
			orgaMongo.db.collection(orgaMongo.collectionName).createIndex(
				{
					'code': 1,
				},{
					name: 'ix_orga_code'
				}
			);
		}
		if(!await orgaUserMongo.db.collection(orgaUserMongo.collectionName).indexExists('ix_orgauser_id'))
		{
			orgaUserMongo.db.collection(orgaUserMongo.collectionName).createIndex(
				{
					'id': 1,
				},{
					name: 'ix_orgauser_id'
				}
			);
		}
		if(!await orgaUserMongo.db.collection(orgaUserMongo.collectionName).indexExists('ix_orgauser_orgaId'))
		{
			orgaUserMongo.db.collection(orgaUserMongo.collectionName).createIndex(
				{
					'orgaId': 1,
				},{
					name: 'ix_orgauser_orgaId'
				}
			);
		}
		if(!await orgaUserMongo.db.collection(orgaUserMongo.collectionName).indexExists('ix_orgauser_userId'))
		{
			orgaUserMongo.db.collection(orgaUserMongo.collectionName).createIndex(
				{
					'userId': 1,
				},{
					name: 'ix_orgauser_userId'
				}
			);
		}
		if(!await orgaUserMongo.db.collection(orgaUserMongo.collectionName).indexExists('ix_orgauser_userId_orgaId'))
		{
			orgaUserMongo.db.collection(orgaUserMongo.collectionName).createIndex(
				{
					'userId': 1,
					'orgaId': 1,
					'enabled': 1,
				},{
					name: 'ix_orgauser_userId_orgaId'
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