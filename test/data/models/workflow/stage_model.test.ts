import { StageModel } from '../../../../src/data/models/workflow/stage_model';
import { Stage } from '../../../../src/domain/entities/workflow/stage';


describe('Test de stage model', () => {

	const listStages: StageModel[] = [
		new StageModel('aaa', 'bbb', 1, {}, true, false)
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('convertir a entidad', () => {
		//arrange
		const model = listStages[0];
		const entity = { _id:model.id,id: model.id, name:model.name, order: model.order, queryOut: model.queryOut, enabled: true, builtIn: false, deleted: undefined, expires: undefined, updated: undefined,} as unknown as Stage;

		entity.created = model.created;

		//act
		const result = model.toEntity();

		//assert
		expect(result).toEqual(entity);
	});

});