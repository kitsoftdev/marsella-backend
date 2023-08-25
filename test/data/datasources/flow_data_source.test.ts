import { FlowDataSourceImpl} from '../../../src/data/datasources/flow_data_source';
import { FlowModel } from '../../../src/data/models/workflow/flow_model';
import { MongoWrapper } from '../../../src/core/wrappers/mongo_wrapper';
import { ModelContainer } from '../../../src/core/model_container';


describe('Flow MongoDB DataSource', () => {

	let dataSource: FlowDataSourceImpl;
	let mongoWrapper: MongoWrapper<FlowModel>;

	const listFlows: FlowModel[] = [
		new FlowModel('ooo', 'Súper Flow', [], true, true),
		new FlowModel('rrr', 'Flow', [], true, false),
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
			updateDirect: jest.fn(),
		} as unknown) as MongoWrapper<FlowModel>;

		dataSource = new FlowDataSourceImpl(mongoWrapper);

	});

	afterEach(()=> {
		jest.restoreAllMocks();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('conseguir muchos flows en una lista', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(listFlows)));

		//act
		const data = await dataSource.getMany({_id: 'ooo'});

		//assert
		expect(mongoWrapper.getMany).toBeCalledTimes(1);
		expect(data).toEqual(new ModelContainer(listFlows));

	});

	test('conseguir un flow', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listFlows[0])));

		//act
		const data = await dataSource.getOne({_id: 'ooo'});

		//assert
		expect(mongoWrapper.getOne).toBeCalledTimes(1);
		expect(data).toEqual(ModelContainer.fromOneItem(listFlows[0]));

	});

	test('agregar un flow', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'add').mockImplementation(() => Promise.resolve(true));
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listFlows[0])));
		//act
		const data = await dataSource.add(listFlows[0]);

		//assert
		expect(mongoWrapper.add).toBeCalledWith(listFlows[0]);
		expect(data).toEqual(ModelContainer.fromOneItem(listFlows[0]));

	});

	test('modificar un flow', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'update').mockImplementation(() => Promise.resolve(true));
		jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listFlows[0])));
		//act
		const data = await dataSource.update(listFlows[0].id, listFlows[0]);

		//assert
		expect(mongoWrapper.update).toBeCalledWith(listFlows[0].id, listFlows[0]);
		expect(data).toEqual(ModelContainer.fromOneItem(listFlows[0]));

	});

	test('deshabilitar un flow', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'enable').mockImplementation(() => Promise.resolve(true));

		//act
		const data = await dataSource.enable(listFlows[0].id, false);

		//assert
		expect(mongoWrapper.enable).toBeCalledWith(listFlows[0].id, false);
		expect(data).toEqual(true);

	});	

	test('delete un flow', async () => {
		//arrange
		jest.spyOn(mongoWrapper, 'delete').mockImplementation(() => Promise.resolve(true));

		//act
		const data = await dataSource.delete(listFlows[0].id);

		//assert
		expect(mongoWrapper.delete).toBeCalledWith(listFlows[0].id);
		expect(data).toEqual(true);

	});

	test('asigna Id cuando no lo tiene', async () => {
		//arrange
		let user = listFlows[0];
		user.id = '';
		//act
		user = dataSource.setId(user);

		//assert
		expect(user._id).toBeDefined();
		expect(user.id).toEqual(user._id);

	});	

	describe('Nuevos tests de métodos adaptados', () => {

		test('getAll - traer todas las flownizaciones', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getMany').mockImplementation(() => Promise.resolve(new ModelContainer(listFlows)));

			//act
			const data = await dataSource.getAll(testSort);
	
			//assert
			expect(mongoWrapper.getMany).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listFlows));
		});

		test('getById - traer flownización por Id', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(new ModelContainer(listFlows)));

			//act
			const data = await dataSource.getById('oid');
	
			//assert
			expect(mongoWrapper.getOne).toBeCalledTimes(1);
			expect(data).toEqual(new ModelContainer(listFlows));
		});		

		test('modificar un flow directo', async () => {
			//arrange
			jest.spyOn(mongoWrapper, 'updateDirect').mockImplementation(() => Promise.resolve(true));
			jest.spyOn(mongoWrapper, 'getOne').mockImplementation(() => Promise.resolve(ModelContainer.fromOneItem(listFlows[0])));
			//act
			const data = await dataSource.updateDirect(listFlows[0].id, listFlows[0]);
	
			//assert
			expect(mongoWrapper.updateDirect).toBeCalledWith(listFlows[0].id, listFlows[0]);
			expect(data).toEqual(ModelContainer.fromOneItem(listFlows[0]));
	
		});	


	});

});