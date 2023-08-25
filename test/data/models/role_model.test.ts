import { RoleModel } from '../../../src/data/models/role_model';


describe('Test de role model', () => {

	const listRoles: RoleModel[] = [
		new RoleModel('fff', true),
		new RoleModel('hhh', true),
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('convertir a entidad', () => {
		//arrange
		const model = listRoles[0];

		//act
		const result = model.toEntity();

		//assert
		expect(result).toEqual({id: model.id, name:model.name, enabled: model.enabled});
	});

});