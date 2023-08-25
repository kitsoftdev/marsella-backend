import { TokenModel } from '../../../src/data/models/token_model';


describe('Test de user model', () => {

	const listTokens: TokenModel[] = [
		new TokenModel('ttt', 'Súper Admin', []),
		new TokenModel('kkk', 'Admin', []),
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('convertir a entidad', () => {
		//arrange
		const model = listTokens[0];

		//act
		const result = model.toEntity();

		//assert
		expect(result).toEqual({value: model.value});
	});

});