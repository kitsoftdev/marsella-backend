import { MongoError } from 'mongodb';
import { DatabaseFailure, GenericFailure, NetworkFailure } from '../../../src/core/errors/failures';
import { ModelContainer } from '../../../src/core/model_container';
import { HashPassword } from '../../../src/core/password_hash';
import { OrgaUserDataSource } from '../../../src/data/datasources/orgauser_data_source';
import { OrgaDataSource } from '../../../src/data/datasources/orga_data_source';
import { PasswordDataSource } from '../../../src/data/datasources/password_data_source';
import { RoleDataSource } from '../../../src/data/datasources/role_data_source';
import { UserDataSource } from '../../../src/data/datasources/user_data_source';
import { OrgaUserModel } from '../../../src/data/models/orgauser_model';
import { OrgaModel } from '../../../src/data/models/orga_model';
import { PasswordModel } from '../../../src/data/models/password_model';
import { RoleModel } from '../../../src/data/models/role_model';
import { UserModel } from '../../../src/data/models/user_model';
import { OrgaUserRepositoryImpl } from '../../../src/data/repositories/orgauser_repository_impl';
import { OrgaRepositoryImpl } from '../../../src/data/repositories/orga_repository_impl';
import { AuthRepositoryImpl } from '../../../src/data/repositories/auth_repository_impl';
import { PasswordRepositoryImpl } from '../../../src/data/repositories/password_repository_impl';
import { RoleRepositoryImpl } from '../../../src/data/repositories/role_repository_impl';
import { UserRepositoryImpl } from '../../../src/data/repositories/user_repository_impl';
import { TokenModel } from '../../../src/data/models/token_model';
import { Token } from '../../../src/domain/entities/token';
import { Role } from '../../../src/domain/entities/role';
import { Auth } from '../../../src/domain/entities/auth';

import { generateJWT, validJWT } from '../../../src/core/jwt';
import { AuthRepository } from '../../../src/domain/repositories/auth_repository';
import { PasswordRepository } from '../../../src/domain/repositories/password_repository';
import { OrgaUserRepository } from '../../../src/domain/repositories/orgauser_repository';
import { OrgaRepository } from '../../../src/domain/repositories/orga_repository';
import { RoleRepository } from '../../../src/domain/repositories/role_repository';
import { UserRepository } from '../../../src/domain/repositories/user_repository';
import firebase from 'firebase-admin';
import { DecodedAuthBlockingToken, DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { User } from '../../../src/domain/entities/user';
import { BaseAuth, DeleteUsersResult, GetUsersResult, ListUsersResult, SessionCookieOptions } from 'firebase-admin/lib/auth/base-auth';
import { ActionCodeSettings } from 'firebase-admin/lib/auth/action-code-settings-builder';
import { CreateRequest, UpdateRequest, AuthProviderConfigFilter, ListProviderConfigResults, AuthProviderConfig, UpdateAuthProviderRequest } from 'firebase-admin/lib/auth/auth-config';
import { UserIdentifier } from 'firebase-admin/lib/auth/identifier';
import { UserImportRecord, UserImportOptions, UserImportResult } from 'firebase-admin/lib/auth/user-import-builder';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { ProjectConfigManager } from 'firebase-admin/lib/auth/project-config-manager';
import { TenantManager } from 'firebase-admin/lib/auth/tenant-manager';
import { GoogleAuth } from '../../../src/core/google_auth';

class MockUserDataSource implements UserDataSource {
	getIfExistsByUsernameEmail(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getByUsernameEmail(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getMany(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<UserModel>>{
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<UserModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<UserModel>>{
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	setId():UserModel{throw new Error('Method not implemented.');}
	getByOrgaId(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getWhoAreNotInOrga(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getById(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getByUsernameOrEmail(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
}

class MockRoleDataSource implements RoleDataSource {
	getByName(): Promise<ModelContainer<RoleModel>> {
		throw new Error('Method not implemented.');
	}
	getAll(): Promise<ModelContainer<RoleModel>> {
		throw new Error('Method not implemented.');
	}
	getMany(): Promise<ModelContainer<RoleModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<RoleModel>>{
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<RoleModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<RoleModel>>{
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	setId():RoleModel{throw new Error('Method not implemented.');}
}

class MockOrgaDataSource implements OrgaDataSource {
	getByOrgasIdArray(): Promise<ModelContainer<OrgaModel>> {
		throw new Error('Method not implemented.');
	}
	getAll(): Promise<ModelContainer<OrgaModel>> {
		throw new Error('Method not implemented.');
	}
	getById(): Promise<ModelContainer<OrgaModel>> {
		throw new Error('Method not implemented.');
	}
	getByCode(): Promise<ModelContainer<OrgaModel>> {
		throw new Error('Method not implemented.');
	}
	getMany(): Promise<ModelContainer<OrgaModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<OrgaModel>>{
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<OrgaModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<OrgaModel>>{
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	setId():OrgaModel{throw new Error('Method not implemented.');}
}

class MockOrgaUserDataSource implements OrgaUserDataSource {
	getByOrgaId(): Promise<ModelContainer<OrgaUserModel>> {
		throw new Error('Method not implemented.');
	}
	getByUserId(): Promise<ModelContainer<OrgaUserModel>> {
		throw new Error('Method not implemented.');
	}
	getOneBy(): Promise<ModelContainer<OrgaUserModel>> {
		throw new Error('Method not implemented.');
	}
	getMany(): Promise<ModelContainer<OrgaUserModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<OrgaUserModel>>{
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<OrgaUserModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<OrgaUserModel>>{
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	setId():OrgaUserModel{throw new Error('Method not implemented.');}
}
class MockPasswordDataSource implements PasswordDataSource {
	updateByUserId(): Promise<ModelContainer<PasswordModel>> {
		throw new Error('Method not implemented.');
	}
	getByUserId(): Promise<ModelContainer<PasswordModel>> {
		throw new Error('Method not implemented.');
	}
	getMany(): Promise<ModelContainer<PasswordModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<PasswordModel>> {
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	add() : Promise<ModelContainer<PasswordModel>>{
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<PasswordModel>>{
		throw new Error('Method not implemented.');
	}
	setId():PasswordModel{throw new Error('Method not implemented.');}
}

describe('Auth Repository Implementation', () => {
	let mockUserDataSource: UserDataSource;
	let userRepository: UserRepository;
	let mockRoleDataSource: RoleDataSource;
	let roleRepository: RoleRepository;
	let mockOrgaDataSource: OrgaDataSource;
	let orgaRepository: OrgaRepository;
	let mockOrgaUserDataSource: OrgaUserDataSource;
	let orgaUserRepository: OrgaUserRepository;
	let mockPasswordDataSource: PasswordDataSource;
	let passwordRepository: PasswordRepository;
	let authRepository: AuthRepository;
	const googleApp = firebase.initializeApp();
	const mockGoogleAuth = new GoogleAuth(googleApp);
	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
		new UserModel('eee', 'Sujeto', 'sujeto', 'suj@mp.com', true, false),
	];
	listUsers[0].orgas = [{id:'ooo', code:'superOrga'}];
	listUsers[2].orgas = [];
	const listRoles: RoleModel[] = [
		new RoleModel('fff', true),
		new RoleModel('hhh', true),
	];
	const listOrgas: OrgaModel[] = [
		new OrgaModel('ooo', 'Súper Orga', 'superOrga', true, true),
		new OrgaModel('rrr', 'Orga', 'orga', true, false),
	];
	const listOrgaUsers: OrgaUserModel[] = [
		new OrgaUserModel('Súper OrgaUser', 'orgaUser', [{id: 'admin',name:'admin',enabled:true} as Role], true, true),
		new OrgaUserModel('OrgaUser', 'Ouser', [], true, false),
	];
	const testAuth:Auth = {username:'user', password:'4321'};
	const testUser:User = {id: 'id', name:'name', username:'username', email:'email', enabled:true, builtIn:false, created: new Date()};
	const testAuthOrga:Auth = {username:'user', password:'4321', orgaId:'000'};
	const testAuthOrgaNew:Auth = {username:'admin', password:'4321', orgaId:'rrr'};

	const hashPass1 = HashPassword.createHash('4321', '100');
	const hashPass2 = HashPassword.createHash('1234');

	const listPasswords: PasswordModel[] = [
		new PasswordModel('aaa', hashPass1.hash, hashPass1.salt, true, true),
		new PasswordModel('ppp', hashPass2.hash, hashPass2.salt, true, false),
	];
	const testToken = new TokenModel('newToken', 'orgaId', []);
	


	beforeEach(() => {
		jest.clearAllMocks();
		mockUserDataSource = new MockUserDataSource();
		mockRoleDataSource = new MockRoleDataSource();
		mockOrgaDataSource = new MockOrgaDataSource();
		mockOrgaUserDataSource = new MockOrgaUserDataSource();
		userRepository = new UserRepositoryImpl(mockUserDataSource);
		roleRepository = new RoleRepositoryImpl(mockRoleDataSource);
		orgaRepository = new OrgaRepositoryImpl(mockOrgaDataSource);
		orgaUserRepository = new OrgaUserRepositoryImpl(mockOrgaUserDataSource, mockUserDataSource, mockOrgaDataSource);
		mockPasswordDataSource = new MockPasswordDataSource();
		passwordRepository = new PasswordRepositoryImpl(mockPasswordDataSource);



		authRepository = new AuthRepositoryImpl(mockUserDataSource,mockOrgaDataSource,mockPasswordDataSource,mockOrgaUserDataSource, mockGoogleAuth);
	});



	describe('getAuth', () => {
		test('debe entregar un token satisfactorio', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
			//act
			const result = await authRepository.getAuth(testAuth);
			const value = result.getOrElse(ModelContainer.fromOneItem(testToken));

			expect(result.isRight()).toBeTruthy();
			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(1);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(1);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(1);
			expect(value).toBeDefined();
			expect(value?.currentItemCount).toStrictEqual(1);
			expect(validJWT(value.items[0].value, 'lomba')).toBeDefined();
			
		});

		test('debe entregar un token satisfactorio sin orgas asociadas', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.resolve(new ModelContainer<OrgaModel>([])));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
			//act
			const result = await authRepository.getAuth(testAuth);
			const value = result.getOrElse(ModelContainer.fromOneItem(testToken));

			expect(result.isRight()).toBeTruthy();
			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(1);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(1);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(value).toBeDefined();
			expect(value?.currentItemCount).toStrictEqual(1);
			expect(validJWT(value.items[0].value, 'lomba')).toBeDefined();
			
		});

		test('deberá generar error de Database al buscar un token', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await authRepository.getAuth(testAuth);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			
			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al buscar un token', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await authRepository.getAuth(testAuth);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			
			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});
		
		test('deberá generar error genérico al buscar un token', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await authRepository.getAuth(testAuth);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});

		test('deberá generar error genérico al buscar un token sin password', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject('generic'));
			//act
			const testAuthNoPass:Auth = {username:'admin', password:''};
			const result = await authRepository.getAuth(testAuthNoPass);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(0);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});

		test('deberá generar error genérico al buscar un token y no encontrar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(new ModelContainer<UserModel>([])));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await authRepository.getAuth(testAuth);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});

		test('deberá generar error genérico al buscar un token y no encontrar la password', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(new ModelContainer<PasswordModel>([])));
			//act
			const result = await authRepository.getAuth(testAuth);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(1);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});
	});


	describe('registerUser', () => {
		test('debe llamar a los métodos de registrar', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));

			jest.spyOn(mockOrgaDataSource, 'getById').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));

			jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			//act
			const result = await authRepository.registerUser(listUsers[0],testAuthOrga,'admin');
			const value = result.getOrElse(ModelContainer.fromOneItem(listUsers[1]));

			expect(result.isRight());
			expect(mockUserDataSource.add).toBeCalledTimes(1);
			expect(mockPasswordDataSource.add).toBeCalledTimes(1);
			expect(mockOrgaUserDataSource.add).toBeCalledTimes(1);
			expect(value).toEqual(ModelContainer.fromOneItem(listUsers[0]));
		});

		test('deberá generar error de Database al registrar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await authRepository.registerUser(listUsers[0],testAuthOrga,'admin');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(mockUserDataSource.add).toBeCalledTimes(1);
			expect(mockPasswordDataSource.add).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.add).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al registrar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await authRepository.registerUser(listUsers[0],testAuthOrga,'admin');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(mockUserDataSource.add).toBeCalledTimes(1);
			expect(mockPasswordDataSource.add).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.add).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});		

		test('deberá generar error genérico al registrar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await authRepository.registerUser(listUsers[0],testAuthOrga,'admin');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(mockUserDataSource.add).toBeCalledTimes(1);
			expect(mockPasswordDataSource.add).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.add).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});

		test('deberá generar error genérico al registrar un usuario sin password', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			//act
			const testAuthOrgaNoPass:Auth = {username:'user', password:'', orgaId:'000'};
			const result = await authRepository.registerUser(listUsers[0],testAuthOrgaNoPass,'admin');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(mockUserDataSource.add).toBeCalledTimes(0);
			expect(mockPasswordDataSource.add).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.add).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});

		test('deberá generar error genérico al registrar un usuario sin agregar usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.resolve(new ModelContainer<UserModel>([])));
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await authRepository.registerUser(listUsers[0],testAuthOrga,'admin');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(mockUserDataSource.add).toBeCalledTimes(1);
			expect(mockPasswordDataSource.add).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.add).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});

		test('deberá generar error genérico al registrar un usuario sin agregar password', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.resolve(new ModelContainer<PasswordModel>([])));
			//act
			const result = await authRepository.registerUser(listUsers[0],testAuthOrga,'admin');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(mockUserDataSource.add).toBeCalledTimes(1);
			expect(mockPasswordDataSource.add).toBeCalledTimes(1);
			expect(mockOrgaUserDataSource.add).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});

		test('deberá generar error genérico al registrar un usuario sin orgaId', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
			//act
			const result = await authRepository.registerUser(listUsers[0],testAuthOrga,'');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(mockUserDataSource.add).toBeCalledTimes(1);
			expect(mockPasswordDataSource.add).toBeCalledTimes(1);
			expect(mockOrgaUserDataSource.add).toBeCalledTimes(1);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});

		test('deberá generar error genérico al registrar un usuario sin orgaUser', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.resolve(new ModelContainer<OrgaUserModel>([])));
			jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
			
			jest.spyOn(mockOrgaDataSource, 'getById').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));

			jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			//act
			const result = await authRepository.registerUser(listUsers[0],testAuthOrga,'admin');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			//assert
			expect(mockUserDataSource.add).toBeCalledTimes(1);
			expect(mockPasswordDataSource.add).toBeCalledTimes(1);
			expect(mockOrgaUserDataSource.add).toBeCalledTimes(1);
			expect(result.isLeft()).toBeFalsy();
		});
	});

	describe('changeOrga', () => {
		test('debe actulizar un orga satisfactorio', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
			//act
			const result = await authRepository.changeOrga(testAuthOrgaNew);
			const value = result.getOrElse(ModelContainer.fromOneItem(testToken));

			expect(result.isRight());
			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(value).toBeDefined();
			expect(value?.currentItemCount).toStrictEqual(1);
			expect(validJWT(value.items[0].value, 'lomba')).toBeDefined();
			
		});

		test('deberá generar error de Database al actulizar un orga', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			//act
			const result = await authRepository.changeOrga(testAuthOrgaNew);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			
			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de Network al actulizar un orga', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject(new Error('neterror')));
			//act
			const result = await authRepository.changeOrga(testAuthOrgaNew);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			
			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});
		
		test('deberá generar error genérico al actulizar un orga', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await authRepository.changeOrga(testAuthOrgaNew);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});

		test('deberá generar error genérico al actulizar un orga sin orgaId', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject('generic'));
			//act
			const testAuthNoOrga:Auth = {username:'admin', password:'4321', orgaId:''};
			const result = await authRepository.changeOrga(testAuthNoOrga);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(0);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});

		test('deberá generar error genérico al actulizar un orga y no encontrar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(new ModelContainer<UserModel>([])));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await authRepository.changeOrga(testAuthOrgaNew);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});

		test('deberá generar error genérico al actulizar un orga y no encontrar un user.orga', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[2])));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject('generic'));
			//act
			const result = await authRepository.changeOrga(testAuthOrgaNew);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeFalsy();
		});

		test('deberá generar error genérico al actulizar un orga y encontrar el mismo orgaId', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject('generic'));
			//act
			const testAuthEqualOrga:Auth = {username:'admin', password:'4321', orgaId:'ooo'};
			const result = await authRepository.changeOrga(testAuthEqualOrga);
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(1);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(1);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});
	});

	describe('getAuthGoogle', () => {

	
		test('OK debe entregar un token satisfactorio', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
			jest.spyOn(mockGoogleAuth, 'isValid').mockImplementation(() => Promise.resolve(true));

			//act
			const result = await authRepository.getAuthGoogle(testUser, '');
			const value = result.getOrElse(ModelContainer.fromOneItem(testToken));

			expect(result.isRight()).toBeTruthy();
			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(1);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(1);
			expect(value).toBeDefined();
			expect(value?.currentItemCount).toStrictEqual(1);
			expect(validJWT(value.items[0].value, 'lomba')).toBeDefined();
			
		});

		test('sin token de google válido', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
			jest.spyOn(mockGoogleAuth, 'isValid').mockImplementation(() => Promise.resolve(false));

			//act
			const result = await authRepository.getAuthGoogle(testUser, '');
			const value = result.getOrElse(ModelContainer.fromOneItem(testToken));

			expect(result.isLeft()).toBeTruthy();
			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(0);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(value).toBeDefined();
			expect(value?.currentItemCount).toStrictEqual(1);
			
		});

		test('error validando token google', async () => {
			//arrange
			jest.spyOn(mockGoogleAuth, 'isValid').mockImplementation(() => Promise.reject(new Error('error')));

			//act
			const result = await authRepository.getAuthGoogle(testUser, '');


			expect(result.isLeft()).toBeTruthy();
		});

		test('creando el usuario nuevo', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(new ModelContainer<UserModel>([])));
			jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));			
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));			
			jest.spyOn(mockOrgaDataSource, 'getById').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));			
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
			jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));			
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
			jest.spyOn(mockGoogleAuth, 'isValid').mockImplementation(() => Promise.resolve(true));

			//act
			const result = await authRepository.getAuthGoogle(testUser, '');
			const value = result.getOrElse(ModelContainer.fromOneItem(testToken));

			expect(result.isRight()).toBeTruthy();
			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(1);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(1);
			expect(value).toBeDefined();
			expect(value?.currentItemCount).toStrictEqual(1);
			
		});

		test('sin crear el usuario nuevo', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(new ModelContainer<UserModel>([])));
			jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.resolve(new ModelContainer<UserModel>([])));			
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listPasswords[0])));
			jest.spyOn(mockGoogleAuth, 'isValid').mockImplementation(() => Promise.resolve(true));

			//act
			const result = await authRepository.getAuthGoogle(testUser, '');
			const value = result.getOrElse(ModelContainer.fromOneItem(testToken));

			expect(result.isLeft()).toBeTruthy();
			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(value).toBeDefined();
			expect(value?.currentItemCount).toStrictEqual(1);
			
		});

		test('deberá generar error de DatabaseFailure al buscar un token', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject(new MongoError('mongoerror')));
			jest.spyOn(mockGoogleAuth, 'isValid').mockImplementation(() => Promise.resolve(true));

			//act
			const result = await authRepository.getAuthGoogle(testUser, '');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});
			
			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(DatabaseFailure);
		});

		test('deberá generar error de NetworkFailure al buscar un token', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject(new Error('neterror')));
			jest.spyOn(mockGoogleAuth, 'isValid').mockImplementation(() => Promise.resolve(true));

			//act
			const result = await authRepository.getAuthGoogle(testUser, '');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			
			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});
		
		test('deberá generar error genérico al buscar un token', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockGoogleAuth, 'isValid').mockImplementation(() => Promise.resolve(true));

			//act
			const result = await authRepository.getAuthGoogle(testUser, '');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});

		test('deberá generar error genérico al buscar un token sin password', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockGoogleAuth, 'isValid').mockImplementation(() => Promise.resolve(true));			
			//act
			const testAuthNoPass:Auth = {username:'admin', password:''};
			//act
			const result = await authRepository.getAuthGoogle(testUser, '');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});

		test('deberá generar error NetworkFailure al buscar un token y no encontrar un usuario', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(new ModelContainer<UserModel>([])));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockGoogleAuth, 'isValid').mockImplementation(() => Promise.resolve(true));
			//act
			const result = await authRepository.getAuthGoogle(testUser, '');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(0);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(NetworkFailure);
		});

		test('deberá generar error genérico al buscar un token y no encontrar la password', async () => {
			//arrange
			jest.spyOn(mockUserDataSource, 'getByUsernameEmail').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
			jest.spyOn(mockOrgaDataSource, 'getByOrgasIdArray').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockOrgaUserDataSource, 'getOneBy').mockImplementation(() => Promise.reject('generic'));
			jest.spyOn(mockPasswordDataSource, 'getByUserId').mockImplementation(() => Promise.resolve(new ModelContainer<PasswordModel>([])));
			jest.spyOn(mockGoogleAuth, 'isValid').mockImplementation(() => Promise.resolve(true));
			//act
			const result = await authRepository.getAuthGoogle(testUser, '');
			let failure:unknown;
			let value:unknown;

			result.fold(err => {failure = err;}, val => {value = val;});

			expect(mockUserDataSource.getByUsernameEmail).toBeCalledTimes(1);
			expect(mockOrgaDataSource.getByOrgasIdArray).toBeCalledTimes(1);
			expect(mockPasswordDataSource.getByUserId).toBeCalledTimes(0);
			expect(mockOrgaUserDataSource.getOneBy).toBeCalledTimes(0);
			expect(result.isLeft()).toBeTruthy();
			expect(failure).toBeInstanceOf(GenericFailure);
		});
	});


});

