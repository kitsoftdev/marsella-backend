import { FlowModel } from '../../../../src/data/models/workflow/flow_model';
import { Flow } from '../../../../src/domain/entities/workflow/flow';


describe('Test de flow model', () => {

	const listFlows: FlowModel[] = [
		new FlowModel('aaa', 'bbb', [], true, false)
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('convertir a entidad', () => {
		//arrange
		const model = listFlows[0];
		const entity = { _id:model.id,id: model.id, name:model.name, stages: model.stages, enabled: true, builtIn: false, deleted: undefined, expires: undefined, updated: undefined,} as unknown as Flow;

		entity.created = model.created;

		//act
		const result = model.toEntity();

		//assert
		expect(result).toEqual(entity);
	});

});