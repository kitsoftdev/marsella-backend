
import { resolveSoa } from 'dns';
import { generateJWT, isTokenExpired, validJWT } from '../../src/core/jwt';
describe('Test de las funciones de JWT', () => {

	const secretKey = 'lomba';
	const payload1 = {userId:'uuu', roles:'r1,r2'};
	const exp1 = 1 * 60 * 60;


	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('consigue crear un token sin validar', () => {
		//arrange

		//act
		const token = generateJWT(payload1, secretKey, exp1);

		//assert
		expect(token).toBeDefined();
	});

	test('consigue crear un token válido y validar', () => {
		//arrange

		//act
		const token = generateJWT(payload1, secretKey, exp1);
		const verify = validJWT(token, secretKey);
		//assert
		expect(token).toBeDefined();
		expect(verify).toBeDefined();
		expect(verify?.userId).toEqual('uuu');
		expect(verify?.roles).toEqual('r1,r2');
	});

	test('consigue crear un token y check expiration', () => {
		//arrange
		const exp2 = 60 * 60 * -2;
		//act
		const token = generateJWT(payload1, secretKey, exp2);
		const verify = validJWT(token, secretKey);
		const expired = isTokenExpired(token);
		//assert
		expect(token).toBeDefined();
		expect(verify).toBeUndefined();
		expect(expired).toBeTruthy();

	});

	test('pregunta por un token inválido', () => {
		//arrange
		//act
		const expired = isTokenExpired('no-token');
		//assert
		expect(expired).toBeTruthy();

	});



});