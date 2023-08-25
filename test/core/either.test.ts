import { Either } from '../../src/core/either';
import { GenericFailure } from '../../src/core/errors/failures';
import { RoleModel } from '../../src/data/models/role_model';
describe('Test de Either con sus métodos', () => {

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('Crea un left', () => {
		//arrange
		const fail = new GenericFailure('error');
		//act
		const l = Either.left<GenericFailure, RoleModel>(fail);

		//assert
		expect(l.getOrElse(new RoleModel('role', true))).toBeInstanceOf(RoleModel);
		expect(l.isLeft()).toBeTruthy();
		expect(l.isRight()).toBeFalsy();

	});

	test('Usa el map', () => {
		//arrange
		const fail = new GenericFailure('error');
		//act
		const l = Either.left<GenericFailure, RoleModel>(fail);

		//assert
		const mappedResult = l.map(value => value.name = 'fff');

		mappedResult.fold(
			error => expect(error.kind).toEqual('GenericFailure'),
			val => expect(val).toBeUndefined() 
		);

	});    

	test('Usa el map right', () => {
		//arrange
		const role = new RoleModel('role', true);
		//act
		const r = Either.right<GenericFailure, RoleModel>(role);

		//assert
		const mappedResult = r.map(value => value.name = 'oro');

		mappedResult.fold(
			error => expect(error.kind).toBeUndefined(),
			val => expect(val).toEqual('oro') 
		);

	});    


	test('Usa el flatmap', () => {
		//arrange
		const fail = new GenericFailure('error');
		//act
		const l = Either.left<GenericFailure, RoleModel>(fail);

		//assert
		const mappedResult = l.flatMap(() => Either.right((value: { name: string; }) => value.name = 'fff'));

		mappedResult.fold(
			error => expect(error.kind).toEqual('GenericFailure'),
			val => expect(val).toBeUndefined() 
		);
	});    

	test('Usa el flatmap right', () => {
		//arrange
		const role = new RoleModel('role', true);
		//act
		const l = Either.right<GenericFailure, RoleModel>(role);

		//assert
		const mappedResult = l.flatMap(() => Either.right((value: { name: string; }) => value.name = 'oso'));

		mappedResult.fold(
			error => expect(error.kind).toBeUndefined(), val => {
				expect(val).toBeDefined();
			}
		);
	});    

	test('Crea un right', () => {
		//arrange
		const role = new RoleModel('rrr', true);
		//act
		const l = Either.right<GenericFailure, RoleModel>(role);

		//assert
		expect(l.getOrElse(new RoleModel('nnn', true)).name).toEqual('rrr');
		expect(l.isRight()).toBeTruthy();
		expect(l.isLeft()).toBeFalsy();

	});  

	test('Crea un right y usa el fold', () => {
		//arrange
		const role = new RoleModel('rrr', true);
		//act
		const result = Either.right<GenericFailure, RoleModel>(role);
		let failure:unknown;
		let value:unknown;

		result.fold(err => {failure = err;}, val => {value = val;});
		//assert
		expect(result.getOrElse(new RoleModel('nnn', true)).name).toEqual('rrr');
		expect(value).toBeDefined();
		expect(failure).toBeUndefined();


	});  

});