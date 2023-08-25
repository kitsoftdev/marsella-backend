import { OrgaModel } from '../../../src/data/models/orga_model';


describe('Test de orga model', () => {

	const listOrgas: OrgaModel[] = [
		new OrgaModel('ooo', 'Súper Orga', 'superOrga', true, true),
		new OrgaModel('rrr', 'Orga', 'orga', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('convertir a entidad', () => {
		//arrange
		const model = listOrgas[0];

		//act
		const result = model.toEntity();

		//assert
		expect(result).toEqual({id: model.id, name: model.name, code: model.code, enabled: model.enabled, builtIn: model.builtIn, created: model.created});
	});

});