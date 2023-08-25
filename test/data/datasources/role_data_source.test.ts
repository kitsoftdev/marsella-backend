import { RoleDataSourceImpl} from '../../../src/data/datasources/role_data_source';
import { RoleModel } from '../../../src/data/models/role_model';
import { MongoWrapper } from '../../../src/core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../../src/core/model_container';


describe('Role MongoDB DataSource', () => {

	let dataSource: RoleDataSourceImpl;
	let mongoWrapper: MongoWrapper<RoleModel>;

	const listRoles: RoleModel[] = [
		new RoleModel('fff', true),
		new RoleModel('hhh', true),
	];

	beforeAll(async () => {
		mongoWrapper = ({
			getMany: jest.fn(),
			getOne: jest.fn(),
			add: jest.fn(),
			update: jest.fn(),
			enable: jest.fn(),
			delete: jest.fn(),
		} as unknown) as MongoWrapper<RoleModel>;

		dataSource = new RoleDataSourceImpl(mongoWrapper);

	});

	afterEach(()=> {
		jest.restoreAllMocks();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('conseguir muchos roles en una lista', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(listRoles)));

		//act
		const data = await dataSource.getMany({name: 'fff'});

		//assert
		expect(mongoWrapper.getMany).toBeCalledTimes(1);
		expect(data).toEqual(new ModelContainer(listRoles));

	});

	test('conseguir un rol', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listRoles[0])));

		//act
		const data = await dataSource.getOne({_id: 'fff'});

		//assert
		expect(mongoWrapper.getOne).toBeCalledTimes(1);
		expect(data).toEqual(ModelContainer.fromOneItem(listRoles[0]));

	});

	test('agregar un rol', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'add').mockImplementation(() => Promise.resolve(true));
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listRoles[0])));
		//act
		const data = await dataSource.add(listRoles[0]);

		//assert
		expect(mongoWrapper.add).toBeCalledWith(listRoles[0]);
		expect(data).toEqual(ModelContainer.fromOneItem(listRoles[0]));

	});

	test('modificar un rol', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'update').mockImplementation(() => Promise.resolve(true));
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listRoles[0])));
		//act
		const data = await dataSource.update(listRoles[0].id, listRoles[0]);

		//assert
		expect(mongoWrapper.update).toBeCalledWith(listRoles[0].id, listRoles[0]);
		expect(data).toEqual(ModelContainer.fromOneItem(listRoles[0]));

	});

	test('deshabilitar un rol', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'enable').mockImplementation(() => Promise.resolve(true));

		//act
		const data = await dataSource.enable(listRoles[0].id, false);

		//assert
		expect(mongoWrapper.enable).toBeCalledWith(listRoles[0].id, false);
		expect(data).toEqual(true);

	});	

	test('delete un rol', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'delete').mockImplementation(() => Promise.resolve(true));

		//act
		const data = await dataSource.delete(listRoles[0].id);

		//assert
		expect(mongoWrapper.delete).toBeCalledWith(listRoles[0].id);
		expect(data).toEqual(true);

	});	

	test('asigna Id-name cuando no lo tiene', async () => {
		//arrange
		let role = listRoles[0];
		role.id = '';
		//act
		role = dataSource.setId(role);

		//assert
		expect(role._id).toBeDefined();
		expect(role.id).toEqual(role._id);

	});	


	describe('Nuevos métodos de Role', () => {
		test('getByName - trae por nombre de Role', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listRoles[0])));
	
			//act
			const data = await dataSource.getByName('fff');
	
			//assert
			expect(mongoWrapper.getOne).toBeCalledTimes(1);
			expect(data).toEqual(ModelContainer.fromOneItem(listRoles[0]));
	
		});

		test('getAll - trae todos', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getMany').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listRoles[0])));
	
			//act
			const data = await dataSource.getAll();
	
			//assert
			expect(mongoWrapper.getMany).toBeCalledTimes(1);
			expect(data).toEqual(ModelContainer.fromOneItem(listRoles[0]));
	
		});		
	});

});