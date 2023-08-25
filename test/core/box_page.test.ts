import { BoxPages } from '../../src/core/box_page';

describe('Test de Box Page', () => {

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('consigue lista de boxpages', () => {
		//arrange
		

		//act
		

		//assert
		expect(BoxPages.List.length).toEqual(10);
	});

});