import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { RoleModel } from '../../../../src/data/models/role_model';
import { RoleRepository } from '../../../../src/domain/repositories/role_repository';
import { GetRole } from '../../../../src/domain/usecases/roles/get_role';
import { MockRoleRepository } from './role_repository.mock';
describe('Conseguir usuario por orga - Caso de uso', () => {
	
	let mockRoleRepository: RoleRepository;

	const listRoles: RoleModel[] = [
		new RoleModel('fff', true),
		new RoleModel('hhh', true),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockRoleRepository = new MockRoleRepository();
	});

	test('el usecase de conseguir usuario por orga debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockRoleRepository, 'getRole').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<RoleModel>(listRoles))));

		//act
		const useCase = new GetRole(mockRoleRepository);
		const result = await useCase.execute('hhh');
		//assert
		expect(mockRoleRepository.getRole).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(new ModelContainer<RoleModel>(listRoles)));
	});

	test('el usecase de conseguir usuario por orga debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockRoleRepository, 'getRole').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new GetRole(mockRoleRepository);
		const result = await useCase.execute('hhh');
		//assert
		expect(mockRoleRepository.getRole).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});