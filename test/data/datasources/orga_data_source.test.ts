import { OrgaDataSourceImpl} from '../../../src/data/datasources/orga_data_source';
import { OrgaModel } from '../../../src/data/models/orga_model';
import { MongoWrapper } from '../../../src/core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../../src/core/model_container';


describe('Orga MongoDB DataSource', () => {

	let dataSource: OrgaDataSourceImpl;
	let mongoWrapper: MongoWrapper<OrgaModel>;

	const listOrgas: OrgaModel[] = [
		new OrgaModel('ooo', 'Súper Orga', 'superOrga', true, true),
		new OrgaModel('rrr', 'Orga', 'orga', true, false),
	];

	const testSort:[string, 1 | -1][] = [['created', -1]];

	beforeAll(async () => {
		mongoWrapper = ({
			getMany: jest.fn(),
			getOne: jest.fn(),
			add: jest.fn(),
			update: jest.fn(),
			enable: jest.fn(),
			delete: jest.fn(),
		} as unknown) as MongoWrapper<OrgaModel>;

		dataSource = new OrgaDataSourceImpl(mongoWrapper);

	});

	afterEach(()=> {
		jest.restoreAllMocks();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('conseguir muchos orgas en una lista', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(listOrgas)));

		//act
		const data = await dataSource.getMany({_id: 'ooo'});

		//assert
		expect(mongoWrapper.getMany).toBeCalledTimes(1);
		expect(data).toEqual(new ModelContainer(listOrgas));

	});

	test('conseguir un orga', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));

		//act
		const data = await dataSource.getOne({_id: 'ooo'});

		//assert
		expect(mongoWrapper.getOne).toBeCalledTimes(1);
		expect(data).toEqual(ModelContainer.fromOneItem(listOrgas[0]));

	});

	test('agregar un orga', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'add').mockImplementation(() => Promise.resolve(true));
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));
		//act
		const data = await dataSource.add(listOrgas[0]);

		//assert
		expect(mongoWrapper.add).toBeCalledWith(listOrgas[0]);
		expect(data).toEqual(ModelContainer.fromOneItem(listOrgas[0]));

	});

	test('modificar un orga', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'update').mockImplementation(() => Promise.resolve(true));
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listOrgas[0])));
		//act
		const data = await dataSource.update(listOrgas[0].id, listOrgas[0]);

		//assert
		expect(mongoWrapper.update).toBeCalledWith(listOrgas[0].id, listOrgas[0]);
		expect(data).toEqual(ModelContainer.fromOneItem(listOrgas[0]));

	});

	test('deshabilitar un orga', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'enable').mockImplementation(() => Promise.resolve(true));

		//act
		const data = await dataSource.enable(listOrgas[0].id, false);

		//assert
		expect(mongoWrapper.enable).toBeCalledWith(listOrgas[0].id, false);
		expect(data).toEqual(true);

	});	

	test('delete un orga', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'delete').mockImplementation(() => Promise.resolve(true));

		//act
		const data = await dataSource.delete(listOrgas[0].id);

		//assert
		expect(mongoWrapper.delete).toBeCalledWith(listOrgas[0].id);
		expect(data).toEqual(true);

	});

	test('asigna Id cuando no lo tiene', async () => {
		//arrange
		let user = listOrgas[0];
		user.id = '';
		//act
		user = dataSource.setId(user);

		//assert
		expect(user._id).toBeDefined();
		expect(user.id).toEqual(user._id);

	});	

	describe('Nuevos tests de métodos adaptados', () => {

		test('getAll - traer todas las organizaciones', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(listOrgas)));

			//act
			const data = await dataSource.getAll(testSort);
	
			//assert
			expect(mongoWrapper.getMany).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listOrgas));
		});

		test('getById - traer organización por Id', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(new ModelContainer(listOrgas)));

			//act
			const data = await dataSource.getById('oid');
	
			//assert
			expect(mongoWrapper.getOne).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listOrgas));
		});		

		test('getByCode - traer organización por código', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(new ModelContainer(listOrgas)));

			//act
			const data = await dataSource.getByCode('oid', '');
	
			//assert
			expect(mongoWrapper.getOne).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listOrgas));
		});				

		test('getByCode - traer organización por array de id', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(listOrgas)));

			//act
			const data = await dataSource.getByOrgasIdArray(['oid', 'oid2']);
	
			//assert
			expect(mongoWrapper.getMany).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listOrgas));
		});		

	});

});