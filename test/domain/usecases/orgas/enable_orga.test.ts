import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { OrgaModel } from '../../../../src/data/models/orga_model';
import { OrgaRepository } from '../../../../src/domain/repositories/orga_repository';
import { EnableOrga } from '../../../../src/domain/usecases/orgas/enable_orga';
import { MockOrgaRepository } from './orga_repository.mock';
describe('Habilitar usuario - Caso de uso', () => {
	
	let mockOrgaRepository: OrgaRepository;

	const listOrgas: OrgaModel[] = [
		new OrgaModel('ooo', 'Súper Orga', 'superOrga', true, true),
		new OrgaModel('rrr', 'Orga', 'orga', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockOrgaRepository = new MockOrgaRepository();
	});

	test('el usecase de habilitar usuario debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockOrgaRepository, 'enableOrga').mockImplementation(() => Promise.resolve(Either.right(true)));

		//act
		const useCase = new EnableOrga(mockOrgaRepository);
		const result = await useCase.execute(listOrgas[0].id, false);
		//assert
		expect(mockOrgaRepository.enableOrga).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(true));
	});

	test('el usecase de habilitar usuario debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockOrgaRepository, 'enableOrga').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new EnableOrga(mockOrgaRepository);
		const result = await useCase.execute(listOrgas[0].id, false);
		//assert
		expect(mockOrgaRepository.enableOrga).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});