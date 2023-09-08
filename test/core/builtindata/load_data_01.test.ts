import { Db } from 'mongodb';
import {checkData01, data_insert01} from '../../../src/core/builtindata/load_data_01';
import { ModelContainer } from '../../../src/core/model_container';
import { OrgaDataSource } from '../../../src/data/datasources/orga_data_source';
import { OrgaUserDataSource } from '../../../src/data/datasources/orgauser_data_source';
import { PasswordDataSource } from '../../../src/data/datasources/password_data_source';
import { RoleDataSource } from '../../../src/data/datasources/role_data_source';
import { UserDataSource } from '../../../src/data/datasources/user_data_source';
import { OrgaModel } from '../../../src/data/models/orga_model';
import { OrgaUserModel } from '../../../src/data/models/orgauser_model';
import { PasswordModel } from '../../../src/data/models/password_model';
import { RoleModel } from '../../../src/data/models/role_model';
import { UserModel } from '../../../src/data/models/user_model';
import { NoSQLDatabaseWrapper } from '../../../src/core/wrappers/mongo_wrapper';

class MockUserDataSource implements UserDataSource {
	getIfExistsByUsernameEmail(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
	getByUsernameEmail(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented.');
	}
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
	getMany(): Promise<ModelContainer<UserModel>> {
		throw new Error('Method not implemented 1.');
	}
	getOne(): Promise<ModelContainer<UserModel>>{
		throw new Error('Method not implemented 2.');
	}
	add() : Promise<ModelContainer<UserModel>>{
		throw new Error('Method not implemented 3.');
	}
	update(): Promise<ModelContainer<UserModel>>{
		throw new Error('Method not implemented 4.');
	}
	enable(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean>{
		throw new Error('Method not implemented.');
	}
	setId():UserModel{throw new Error('Method not implemented.');}
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
		throw new Error('Method not implemented 5.');
	}
	add() : Promise<ModelContainer<RoleModel>>{
		throw new Error('Method not implemented 6.');
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
		throw new Error('Method not implemented 7.');
	}
	getOne(): Promise<ModelContainer<OrgaModel>>{
		throw new Error('Method not implemented 8.');
	}
	add() : Promise<ModelContainer<OrgaModel>>{
		throw new Error('Method not implemented 9.');
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
		throw new Error('Method not implemented 10.');
	}
	getOne(): Promise<ModelContainer<OrgaUserModel>>{
		throw new Error('Method not implemented 11.');
	}
	add() : Promise<ModelContainer<OrgaUserModel>>{
		throw new Error('Method not implemented 12.');
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
		throw new Error('Method not implemented 13.');
	}
	getOne(): Promise<ModelContainer<PasswordModel>> {
		throw new Error('Method not implemented 14.');
	}
	enable(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean> {
		throw new Error('Method not implemented 15.');
	}
	add() : Promise<ModelContainer<PasswordModel>>{
		throw new Error('Method not implemented 16.');
	}
	update(): Promise<ModelContainer<PasswordModel>>{
		throw new Error('Method not implemented.');
	}
	setId():PasswordModel{throw new Error('Method not implemented.');}
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

	let mockUserDataSource: UserDataSource;
	let mockRoleDataSource: RoleDataSource;
	let mockOrgaDataSource: OrgaDataSource;
	let mockOrgaUserDataSource: OrgaUserDataSource;
	let mockPasswordDataSource: PasswordDataSource;
	let mockWrapperUser: MockWrapper<UserModel>;
	let mockWrapperRole: MockWrapper<RoleModel>;
	let mockWrapperPass: MockWrapper<PasswordModel>;
	let mockWrapperOrga: MockWrapper<OrgaModel>;
	let mockWrapperOrgaUser: MockWrapper<OrgaUserModel>;

	beforeEach(() => {
		jest.clearAllMocks();

		mockUserDataSource = new MockUserDataSource();
		mockRoleDataSource = new MockRoleDataSource();
		mockOrgaDataSource = new MockOrgaDataSource();
		mockOrgaUserDataSource = new MockOrgaUserDataSource();
		mockPasswordDataSource = new MockPasswordDataSource();
		mockWrapperUser = new MockWrapper('users', (jest.fn() as unknown) as Db);
		mockWrapperRole = new MockWrapper('roles', (jest.fn() as unknown) as Db);
		mockWrapperPass = new MockWrapper('passes', (jest.fn() as unknown) as Db);
		mockWrapperOrga = new MockWrapper('orgas', (jest.fn() as unknown) as Db);
		mockWrapperOrgaUser = new MockWrapper('orgausers', (jest.fn() as unknown) as Db);

	});

	//const test_roleName = 'admin';
	const test_roles = data_insert01.roles;
	const test_users = data_insert01.users;
	const test_orgas = data_insert01.orgas;
	//const test_orgausers = data_insert01.orgausers;

	test('Revisión de roles', () => {
		//arrange
		const roles = data_insert01.roles;
		//act

		//assert
		expect(roles.length).toEqual(5);
	});

	test('Revisión de usuarios', () => {
		//arrange
		const users = data_insert01.users;
		//act
		const len = users.length;
		const enables = users.filter(e=>e.enabled == true).length;
		const builtins = users.filter(e=>e.builtIn == true).length;

		//assert
		expect(len).toEqual(7);
		expect(enables).toEqual(5);
		expect(builtins).toEqual(2);
	});

	test('Revisión de organizaciones', () => {
		//arrange
		const orgas = data_insert01.orgas;
		//act
		const len = orgas.length;
		const enables = orgas.filter(e=>e.enabled == true).length;
		const builtins = orgas.filter(e=>e.builtIn == true).length;

		//assert
		expect(len).toEqual(2);
		expect(enables).toEqual(2);
		expect(builtins).toEqual(2);
	});

	test('Revisión de asociación de orgas con usuarios', () => {
		//arrange
		const users = data_insert01.users;
		const orgas = data_insert01.orgas;
		const orgausers = data_insert01.orgausers;
		//act
		const len = orgausers.length;
		const ascSuper = orgausers.filter(a=>a.orgaId == orgas[0].id);
		const ascAdmin = orgausers.filter(a=>a.orgaId == orgas[1].id);
        
		//assert
		expect(len).toEqual(7);
		expect(ascSuper.length).toEqual(1);
		expect(ascAdmin.length).toEqual(6);
	});

	test('debe agregar roles, usuarios, orgas y orgausers', async () => {
		//arrange

		const model_con_role = ModelContainer.fromOneItem(new RoleModel(test_roles[0].name, test_roles[0].enabled));
		const model_void_role = new ModelContainer<RoleModel>([]);
		const model_con_user = ModelContainer.fromOneItem(new UserModel(test_users[1].id, test_users[1].name, test_users[1].username, test_users[1].email, test_users[1].enabled, test_users[1].builtIn));
		const model_void_user = new ModelContainer<UserModel>([]);
		const model_con_orga = ModelContainer.fromOneItem(new OrgaModel(test_orgas[0].id, test_orgas[0].name, test_orgas[0].code, test_orgas[0].enabled, test_orgas[0].builtIn));
		const model_void_orga = new ModelContainer<OrgaModel>([]);
		const model_con_orus = ModelContainer.fromOneItem(new OrgaUserModel(model_con_orga.items[0].id, model_con_user.items[0].id, [model_con_role.items[0].toEntity()], true, false));
		const model_void_orus = new ModelContainer<OrgaUserModel>([]);
		const model_con_pass = ModelContainer.fromOneItem(new PasswordModel(test_users[1].id, '', '', test_users[1].enabled, false));


		jest.spyOn(mockRoleDataSource, 'getOne').mockImplementation(() => Promise.resolve(model_void_role));

		jest.spyOn(mockRoleDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_role));

		jest.spyOn(mockUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(model_void_user));

		jest.spyOn(mockUserDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_user));

		jest.spyOn(mockUserDataSource, 'update').mockImplementation(() => Promise.resolve(model_con_user));			

		jest.spyOn(mockPasswordDataSource, 'delete').mockImplementation(() => Promise.resolve(true));
		

		jest.spyOn(mockPasswordDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_pass));

		jest.spyOn(mockOrgaDataSource, 'getOne').mockImplementation(() => Promise.resolve(model_void_orga));

		jest.spyOn(mockOrgaDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_orga));

		jest.spyOn(mockOrgaUserDataSource, 'getOne').mockImplementation(() => Promise.resolve(model_void_orus));

		jest.spyOn(mockOrgaUserDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_orus));

		
		await checkData01(mockRoleDataSource, mockUserDataSource, mockPasswordDataSource, mockOrgaDataSource, mockOrgaUserDataSource, mockWrapperUser, mockWrapperRole, mockWrapperPass, mockWrapperOrga, mockWrapperOrgaUser);

		expect(mockRoleDataSource.getOne).toBeCalledTimes(5);
		expect(mockRoleDataSource.add).toBeCalledTimes(5);
		expect(mockUserDataSource.getOne).toBeCalledTimes(7);
		expect(mockUserDataSource.add).toBeCalledTimes(7);

		//expect(mockPasswordDataSource.delete).toBeCalledTimes(7);
		//expect(mockPasswordDataSource.add).toBeCalledTimes(7);

		expect(mockOrgaDataSource.getOne).toBeCalledTimes(2);
		expect(mockOrgaDataSource.add).toBeCalledTimes(2);
		expect(mockOrgaUserDataSource.getOne).toBeCalledTimes(7);
		expect(mockOrgaUserDataSource.add).toBeCalledTimes(7);	
	});

});