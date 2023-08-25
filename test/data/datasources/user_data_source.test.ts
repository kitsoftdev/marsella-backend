import { UserDataSourceImpl} from '../../../src/data/datasources/user_data_source';
import { UserModel } from '../../../src/data/models/user_model';
import { MongoWrapper } from '../../../src/core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../../src/core/model_container';


describe('User MongoDB DataSource', () => {

	let dataSource: UserDataSourceImpl;
	let mongoWrapper: MongoWrapper<UserModel>;

	const listUsers: UserModel[] = [
		new UserModel('sss', 'Súper Admin', 'superadmin', 'sa@mp.com', true, true),
		new UserModel('aaa', 'Admin', 'admin', 'adm@mp.com', true, false),
	];

	beforeAll(async () => {
		mongoWrapper = ({
			getMany: jest.fn(),
			getOne: jest.fn(),
			add: jest.fn(),
			update: jest.fn(),
			enable: jest.fn(),
			delete: jest.fn(),
		} as unknown) as MongoWrapper<UserModel>;

		dataSource = new UserDataSourceImpl(mongoWrapper);

	});

	afterEach(()=> {
		jest.restoreAllMocks();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('conseguir muchos usuarios en una lista', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(listUsers)));

		//act
		const data = await dataSource.getMany({_id: 'aaa'});

		//assert
		expect(mongoWrapper.getMany).toBeCalledTimes(1);
		expect(data).toEqual(new ModelContainer(listUsers));

	});

	test('conseguir un usuario', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));

		//act
		const data = await dataSource.getOne({_id: 'aaa'});

		//assert
		expect(mongoWrapper.getOne).toBeCalledTimes(1);
		expect(data).toEqual(ModelContainer.fromOneItem(listUsers[0]));

	});

	test('agregar un usuario', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'add').mockImplementation(() => Promise.resolve(true));
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
		//act
		const data = await dataSource.add(listUsers[0]);

		//assert
		expect(mongoWrapper.add).toBeCalledWith(listUsers[0]);
		expect(data).toEqual(ModelContainer.fromOneItem(listUsers[0]));

	});

	test('modificar un usuario', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'update').mockImplementation(() => Promise.resolve(true));
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listUsers[0])));
		//act
		const data = await dataSource.update(listUsers[0].id, listUsers[0]);

		//assert
		expect(mongoWrapper.update).toBeCalledWith(listUsers[0].id, listUsers[0]);
		expect(data).toEqual(ModelContainer.fromOneItem(listUsers[0]));

	});

	test('deshabilitar un usuario', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'enable').mockImplementation(() => Promise.resolve(true));

		//act
		const data = await dataSource.enable(listUsers[0].id, false);

		//assert
		expect(mongoWrapper.enable).toBeCalledWith(listUsers[0].id, false);
		expect(data).toEqual(true);

	});	

	test('delete un usuario', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'delete').mockImplementation(() => Promise.resolve(true));

		//act
		const data = await dataSource.delete(listUsers[0].id);

		//assert
		expect(mongoWrapper.delete).toBeCalledWith(listUsers[0].id);
		expect(data).toEqual(true);

	});	

	test('asigna Id cuando no lo tiene', async () => {
		//arrange
		let user = listUsers[0];
		user.id = '';
		//act
		user = dataSource.setId(user);

		//assert
		expect(user._id).toBeDefined();
		expect(user.id).toEqual(user._id);

	});	

	describe('Nuevos métodos de user data source', () => {
		test('getByOrgaId - trae usuarios por orgaId', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(listUsers)));
	
			//act
			const data = await dataSource.getByOrgaId('text','aaa');
	
			//assert
			expect(mongoWrapper.getMany).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listUsers));
		});

		test('getWhoAreNotInOrga - trae los no en orgaId', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(listUsers)));
	
			//act
			const data = await dataSource.getWhoAreNotInOrga('text','aaa');
	
			//assert
			expect(mongoWrapper.getMany).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listUsers));
		});	
		
		test('getById - trae por userId', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(new ModelContainer(listUsers)));
	
			//act
			const data = await dataSource.getById('aaa');
	
			//assert
			expect(mongoWrapper.getOne).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listUsers));
		});	
		
		test('getIfExistsByUsernameEmail - por username email', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(new ModelContainer(listUsers)));
	
			//act
			const data = await dataSource.getIfExistsByUsernameEmail('aaa', 'bbb', '');
	
			//assert
			expect(mongoWrapper.getOne).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listUsers));
		});	
		
		test('getByUsernameEmail - por username email', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(new ModelContainer(listUsers)));
	
			//act
			const data = await dataSource.getByUsernameEmail('aaa', 'bbb');
	
			//assert
			expect(mongoWrapper.getOne).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listUsers));
		});				
	});
});