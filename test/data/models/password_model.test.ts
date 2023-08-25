import { PasswordModel } from '../../../src/data/models/password_model';


describe('Test de user model', () => {

	const listPasswords: PasswordModel[] = [
		new PasswordModel('ppp', '', '', true, true),
		new PasswordModel('aaa', '', '', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('convertir a entidad', () => {
		//arrange
		const model = listPasswords[0];

		//act
		const result = model.toEntity();

		//assert
		expect(result).toEqual({id: model.id, userId: model.userId, hash: model.hash, salt: model.salt, enabled: model.enabled, builtIn: model.builtIn, created: model.created});
	});

});