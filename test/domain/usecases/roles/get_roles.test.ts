import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { RoleModel } from '../../../../src/data/models/role_model';
import { RoleRepository } from '../../../../src/domain/repositories/role_repository';
import { GetRoles } from '../../../../src/domain/usecases/roles/get_roles';
import { MockRoleRepository } from './role_repository.mock';
describe('Conseguir usuario - Caso de uso', () => {
	
	let mockRoleRepository: RoleRepository;

	const listRoles: RoleModel[] = [
		new RoleModel('fff', true),
		new RoleModel('hhh', true),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockRoleRepository = new MockRoleRepository();
	});

	test('el usecase de conseguir usuario debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockRoleRepository, 'getRoles').mockImplementation(() => Promise.resolve(Either.right(ModelContainer.fromOneItem(listRoles[0]))));

		//act
		const useCase = new GetRoles(mockRoleRepository);
		const result = await useCase.execute();
		//assert
		expect(mockRoleRepository.getRoles).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(ModelContainer.fromOneItem(listRoles[0])));
	});

	test('el usecase de conseguir usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockRoleRepository, 'getRoles').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new GetRoles(mockRoleRepository);
		const result = await useCase.execute();
		//assert
		expect(mockRoleRepository.getRoles).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});