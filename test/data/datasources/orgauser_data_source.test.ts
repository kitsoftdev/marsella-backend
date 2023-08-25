import { OrgaUserDataSourceImpl} from '../../../src/data/datasources/orgauser_data_source';
import { OrgaUserModel } from '../../../src/data/models/orgauser_model';
import { MongoWrapper } from '../../../src/core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../../src/core/model_container';


describe('OrgaUser MongoDB DataSource', () => {

	let dataSource: OrgaUserDataSourceImpl;
	let mongoWrapper: MongoWrapper<OrgaUserModel>;

	const listOrgaUsers: OrgaUserModel[] = [
		new OrgaUserModel('Súper OrgaUser', 'orgaUser', [], true, true),
		new OrgaUserModel('OrgaUser', 'Ouser', [], true, false),
	];

	beforeAll(async () => {
		mongoWrapper = ({
			getMany: jest.fn(),
			getOne: jest.fn(),
			add: jest.fn(),
			update: jest.fn(),
			enable: jest.fn(),
			delete: jest.fn(),
		} as unknown) as MongoWrapper<OrgaUserModel>;

		dataSource = new OrgaUserDataSourceImpl(mongoWrapper);

	});

	afterEach(()=> {
		jest.restoreAllMocks();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('conseguir muchos orgaUsuarios en una lista', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(listOrgaUsers)));

		//act
		const data = await dataSource.getMany({orgaId: 'Súper OrgaUser'});

		//assert
		expect(mongoWrapper.getMany).toBeCalledTimes(1);
		expect(data).toEqual(new ModelContainer(listOrgaUsers));

	});

	test('conseguir un orgaUsuario', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));

		//act
		const data = await dataSource.getOne({orgaId:'Súper OrgaUser',userId:'orgaUser'});

		//assert
		expect(mongoWrapper.getOne).toBeCalledTimes(1);
		expect(data).toEqual(ModelContainer.fromOneItem(listOrgaUsers[0]));

	});

	test('agregar un orgaUsuario', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'add').mockImplementation(() => Promise.resolve(true));
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
		//act
		const data = await dataSource.add(listOrgaUsers[0]);

		//assert
		expect(mongoWrapper.add).toBeCalledWith(listOrgaUsers[0]);
		expect(data).toEqual(ModelContainer.fromOneItem(listOrgaUsers[0]));

	});

	test('modificar un orgaUsuario', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'update').mockImplementation(() => Promise.resolve(true));
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgaUsers[0])));
		//act
		const data = await dataSource.update(listOrgaUsers[0].id, listOrgaUsers[0]);

		//assert
		expect(mongoWrapper.update).toBeCalledWith(listOrgaUsers[0].id, listOrgaUsers[0]);
		expect(data).toEqual(ModelContainer.fromOneItem(listOrgaUsers[0]));

	});

	test('deshabilitar un orgaUsuario', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'enable').mockImplementation(() => Promise.resolve(true));

		//act
		const data = await dataSource.enable(listOrgaUsers[0].id, false);

		//assert
		expect(mongoWrapper.enable).toBeCalledWith(listOrgaUsers[0].id, false);
		expect(data).toEqual(true);

	});	

	test('delete un orgaUsuario', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'delete').mockImplementation(() => Promise.resolve(true));

		//act
		const data = await dataSource.delete(listOrgaUsers[0].id);

		//assert
		expect(mongoWrapper.delete).toBeCalledWith(listOrgaUsers[0].id);
		expect(data).toEqual(true);

	});	

	test('asigna Id cuando no lo tiene', async () => {
		//arrange
		let orgauser = listOrgaUsers[0];
		orgauser.id = '';
		//act
		orgauser = dataSource.setId(orgauser);

		//assert
		expect(orgauser._id).toBeDefined();
		expect(orgauser.id).toEqual(orgauser._id);

	});	

	describe('Test de los nuevos métodos', () => {

		test('getByOrgaId - conseguir por orgaId', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(listOrgaUsers)));
	
			//act
			const data = await dataSource.getByOrgaId('Súper OrgaUser');
	
			//assert
			expect(mongoWrapper.getMany).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listOrgaUsers));
	
		});

		test('getByUserId - conseguir por userId', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(listOrgaUsers)));
	
			//act
			const data = await dataSource.getByUserId('userId');
	
			//assert
			expect(mongoWrapper.getMany).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listOrgaUsers));
	
		});		

		test('getOneBy - conseguir por orgaId y userId', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(new ModelContainer(listOrgaUsers)));
	
			//act
			const data = await dataSource.getOneBy('orgaId', 'userId');
	
			//assert
			expect(mongoWrapper.getOne).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listOrgaUsers));
	
		});				
	});

});