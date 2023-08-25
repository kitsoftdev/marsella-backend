import request from 'supertest';

import express, { Request, Response } from 'express';
import { generateJWT } from '../../../src/core/jwt';
import { hasRole } from '../../../src/core/presentation/check_role_router';
import { data_insert01 } from '../../../src/core/builtindata/load_data_01';
import server from '../../../src/server';
import { RouterResponse } from '../../../src/core/router_response';

describe('Test de check Role Router', () => {

	//carga de identificadores para las pruebas
	const testUserIdAdmin = data_insert01.users[1].id;
	const testOrgaIdDefault = data_insert01.orgas[1].id;

	const testTokenAdmin = generateJWT({userId:testUserIdAdmin, orgaId: testOrgaIdDefault, roles: 'admin'}, 'lomba', 60*60);

	function TestRouter()
	{
		const router = express.Router();

		router.get('/:id',[hasRole(['admin', 'super'])], async (req: Request, res: Response) => {
			res.status(200).send('OK');
		});
		return router;
	}

	beforeAll(() => {
		server.use('/api/v1/test', TestRouter());
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	//validar roles sin tener autorizado al usuario
	describe('GET /test:id', () => {

		test('debe retornar 403 porque no se verificó token antes que el rol', async () => {
			//arrange
			//act
			const response = await request(server).get('/api/v1/test/1').set({Authorization: 'Bearer ' + testTokenAdmin});

			const roures = response.body as RouterResponse;
			//assert
			expect(response.status).toBe(403);
			expect(roures).toBeDefined();
			expect(roures.data).toBeUndefined();
			expect(roures.error).toBeDefined();
		});

	});    
});