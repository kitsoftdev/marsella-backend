import { OrgaUserModel } from '../../../src/data/models/orgauser_model';


describe('Test de user model', () => {

	const listOrgaUsers: OrgaUserModel[] = [
		new OrgaUserModel('Súper OrgaUser', 'orgaUser', [], true, true),
		new OrgaUserModel('OrgaUser', 'Ouser', [], true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('convertir a entidad', () => {
		//arrange
		const model = listOrgaUsers[0];

		//act
		const result = model.toEntity();

		//assert
		expect(result).toEqual({id: model.id, orgaId: model.orgaId, userId: model.userId, roles: model.roles, builtIn: model.builtIn, enabled: model.enabled, created: model.created});
	});

});