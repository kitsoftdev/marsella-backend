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
	const userMongo = new MongoWrapper<UserModel>('users', db);
	//datasources
	const userDataSource = new UserDataSourceImpl(userMongo);

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
	await checkData01(userDataSource, userMongo,);

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
