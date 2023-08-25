import * as dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { configEnv } from './config_env';
import { checkData01 } from './core/builtindata/load_data_01';
import { MongoWrapper } from './core/wrappers/mongo_wrapper';
import { UserDataSourceImpl } from './data/datasources/user_data_source';
import { UserModel } from './data/models/user_model';
import { UserRepositoryImpl } from './data/repositories/user_repository_impl';
import { AddUser } from './domain/usecases/users/add_user';
import { DeleteUser } from './domain/usecases/users/delete_user';
import { EnableUser } from './domain/usecases/users/enable_user';
import { ExistsUser } from './domain/usecases/users/exists_user';
import { GetUser } from './domain/usecases/users/get_user';
import { GetUsersByOrgaId } from './domain/usecases/users/get_users_by_orga';
import { GetUsersNotInOrga } from './domain/usecases/users/get_users_notin_orga';
import { UpdateUser } from './domain/usecases/users/update_user';
import UsersRouter from './presentation/user_router';
import app from './server';

import firebase, { ServiceAccount } from 'firebase-admin';
import { BlobStorageSourceImpl } from './data/datasources/blob_storage_source';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { RoleModel } from './data/models/role_model';
import { PasswordModel } from './data/models/password_model';
import { OrgaModel } from './data/models/orga_model';
import { OrgaUserModel } from './data/models/orgauser_model';
import { RoleDataSourceImpl } from './data/datasources/role_data_source';
import { PasswordDataSourceImpl } from './data/datasources/password_data_source';
import { OrgaDataSourceImpl } from './data/datasources/orga_data_source';
import { OrgaUserDataSourceImpl } from './data/datasources/orgauser_data_source';

dotenv.config();

export const googleApp = firebase.initializeApp({credential:firebase.credential.cert(JSON.parse(configEnv().FIREBASE_CERT) as ServiceAccount)});

(async () => {
	console.log('NODE_ENV: ' + configEnv().NODE_ENV);
	console.log('PORT: ' + configEnv().PORT);
	console.log('DB: ' + configEnv().DB_NAME);

	const uri = configEnv().MONGODB_URL;
	const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
	
	await client.connect();
	const db = client.db(configEnv().DB_NAME);

	///storage
	const blobService = BlobStorageSourceImpl.newBlobService(configEnv().AZSTORAGEACCOUNT_NAME, configEnv().AZSTORAGEACCOUNT_KEY);

	const storageFiles = new BlobStorageSourceImpl(blobService, 'files');
	storageFiles.startContainer();
    
	///wrappers
	const roleMongo = new MongoWrapper<RoleModel>('roles', db);
	const userMongo = new MongoWrapper<UserModel>('users', db);
	const passMongo = new MongoWrapper<PasswordModel>('passes', db);
	const orgaMongo = new MongoWrapper<OrgaModel>('orgas', db);
	const orgaUserMongo = new MongoWrapper<OrgaUserModel>('orgasusers', db);
	//datasources
	const roleDataSource = new RoleDataSourceImpl(roleMongo);
	const userDataSource = new UserDataSourceImpl(userMongo);
	const passDataSource = new PasswordDataSourceImpl(passMongo);
	const orgaDataSource = new OrgaDataSourceImpl(orgaMongo);
	const orgaUserDataSource = new OrgaUserDataSourceImpl(orgaUserMongo);

	const account = configEnv().AZSTORAGEACCOUNT_NAME;
	const accountKey = configEnv().AZSTORAGEACCOUNT_KEY;
	const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

	// List containers
	const blobServiceClient = new BlobServiceClient(
		`https://${account}.blob.core.windows.net`,
		sharedKeyCredential
	);

	const blobStorageSource = new BlobStorageSourceImpl(blobServiceClient, 'files');

	//repositorios
	const userRepo = new UserRepositoryImpl(userDataSource);

	//revisa que los datos estén cargados.
	await checkData01(roleDataSource, userDataSource, passDataSource, orgaDataSource, orgaUserDataSource, userMongo, roleMongo, passMongo, orgaMongo, orgaUserMongo);

	//routers

	const userMiddleWare = UsersRouter(
		new GetUser(userRepo), new GetUsersByOrgaId(userRepo), 
		new AddUser(userRepo), new UpdateUser(userRepo), 
		new EnableUser(userRepo), new DeleteUser(userRepo), new GetUsersNotInOrga(userRepo),
		new ExistsUser(userRepo)
	);

	app.use('/api/v1/user', userMiddleWare);

	///Fin usuarios
	app.listen(configEnv().PORT, async () => console.log('Running on http://localhost:' + configEnv().PORT));

})();
