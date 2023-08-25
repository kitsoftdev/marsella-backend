import { Either } from '../../../../src/core/either';
import { GenericFailure } from '../../../../src/core/errors/failures';
import { ModelContainer } from '../../../../src/core/model_container';
import { OrgaModel } from '../../../../src/data/models/orga_model';
import { Orga } from '../../../../src/domain/entities/orga';
import { OrgaRepository } from '../../../../src/domain/repositories/orga_repository';
import { GetOrgas } from '../../../../src/domain/usecases/orgas/get_orgas';
import { MockOrgaRepository } from './orga_repository.mock';
describe('Conseguir usuario por orga - Caso de uso', () => {
	
	let mockOrgaRepository: OrgaRepository;

	const listOrgas: OrgaModel[] = [
		new OrgaModel('ooo', 'Súper Orga', 'superOrga', true, true),
		new OrgaModel('rrr', 'Orga', 'orga', true, false),
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockOrgaRepository = new MockOrgaRepository();
	});

	test('el usecase de conseguir usuario por orga debe retornar ok', async () => {
		//arrange
		jest.spyOn(mockOrgaRepository, 'getOrgas').mockImplementation(() => Promise.resolve(Either.right(new ModelContainer<Orga>(listOrgas))));

		//act
		const useCase = new GetOrgas(mockOrgaRepository);
		const result = await useCase.execute();
		//assert
		expect(mockOrgaRepository.getOrgas).toBeCalledTimes(1);
		expect(result.isRight());
		expect(result).toEqual(Either.right(new ModelContainer<Orga>(listOrgas)));
	});

	test('el usecase de conseguir usuario por orga debe retornar failure', async () => {
		//arrange
		jest.spyOn(mockOrgaRepository, 'getOrgas').mockImplementation(() => Promise.resolve(Either.left(new GenericFailure('error'))));

		//act
		const useCase = new GetOrgas(mockOrgaRepository);
		const result = await useCase.execute();
		//assert
		expect(mockOrgaRepository.getOrgas).toBeCalledTimes(1);
		expect(result.isLeft());
		expect(result).toEqual(Either.left(new GenericFailure('error')));
	});

});