import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { RoleModel } from '../../../../src/data/models/role_model';
import { RoleRepository } from '../../../../src/domain/repositories/role_repository';
import { EnableRole } from '../../../../src/domain/usecases/roles/enable_role';
import { MockRoleRepository } from './role_repository.mock';
describe('Habilitar usuario - Caso de uso', () => {
	
	let mockRoleRepository: RoleRepository;

	const listRoles: RoleModel[] = [
		new RoleModel('fff', true),
		new RoleModel('hhh', true),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockRoleRepository = new MockRoleRepository();
	});

	test('el usecase de habilitar usuario debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockRoleRepository, 'enableRole').mockImplementation(() => Promise.resolve(Either.right(true)));

		//act
		const useCase = new EnableRole(mockRoleRepository);
		const result = await useCase.execute(listRoles[0].id, false);
		//assert
		expect(mockRoleRepository.enableRole).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(true));
	});

	test('el usecase de habilitar usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockRoleRepository, 'enableRole').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new EnableRole(mockRoleRepository);
		const result = await useCase.execute(listRoles[0].id, false);
		//assert
		expect(mockRoleRepository.enableRole).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});