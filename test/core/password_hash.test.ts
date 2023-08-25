import { HashPassword } from '../../src/core/password_hash';
describe('Test de las funciones de hashing password', () => {

	const password1 = '1234567890';
	const password2 = 'asdfg';
	const password3 = 'srG5jv)rKO&D1/q9';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('comprueba el primer password', () => {
		//arrange
		const hashed = HashPassword.createHash(password1);
		//act
		const isValid = HashPassword.isValidPassword(hashed.hash, hashed.salt, password1);
		//assert
		expect(isValid).toBeTruthy();
	});

	test('comprueba el segundo password', () => {
		//arrange
		const hashed = HashPassword.createHash(password2);
		//act
		const isValid = HashPassword.isValidPassword(hashed.hash, hashed.salt, password2);
		//assert
		expect(isValid).toBeTruthy();
	});    

	test('comprueba el tercer password', () => {
		//arrange
		const hashed = HashPassword.createHash(password3);
		//act
		const isValid = HashPassword.isValidPassword(hashed.hash, hashed.salt, password3);
		//assert
		expect(isValid).toBeTruthy();
	});     
    
	test('invalid password', () => {
		//arrange
		const hashed = HashPassword.createHash(password1);
		//act
		const isValid = HashPassword.isValidPassword(hashed.hash, hashed.salt, password3);
		//assert
		expect(isValid).toBeFalsy();
	});         

	test('comprueba hash con datos almacenados', () => {
		//arrange
		const hashed1 = HashPassword.createHash(password3);
		const hashed2 = HashPassword.createHash(password3, hashed1.salt);
		//act
		const isValid = HashPassword.isValidPassword(hashed2.hash, hashed2.salt, password3);
		//assert
		expect(isValid).toBeTruthy();
	});     
});