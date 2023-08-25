import express, { Request, Response } from 'express';
import { RouterResponse } from '../core/router_response';
import { UserModel } from '../data/models/user_model';
import { Auth } from '../domain/entities/auth';
import { GetTokenUseCase } from '../domain/usecases/auth/get_token';
import { RegisterUserUseCase } from '../domain/usecases/auth/register_user';
import { ChangeOrgaUseCase } from '../domain/usecases/auth/change_orga';
import { isAuth, isAuthWithoutOrga } from '../core/presentation/valid_token_router';
import { GetTokenGoogleUseCase } from '../domain/usecases/auth/get_token_google';
import { User } from '../domain/entities/user';

export default function AuthRouter(
	getToken: GetTokenUseCase,
	registerUser: RegisterUserUseCase,
	changeOrga: ChangeOrgaUseCase,
	getTokenGoogle: GetTokenGoogleUseCase
) {
	const router = express.Router();

	router.post('/', async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const user = await getToken.execute(req.body);
			//evaluate
			user.fold(error => {
				//something wrong
				code = 401;
				toSend = new RouterResponse('1.0', error as object, 'post', undefined, 'no access');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', undefined, 'access ok');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'no access');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.post('/registration', async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const bodyreg = req.body as {user:UserModel, auth:Auth, roles:string};

			const user = await registerUser.execute(bodyreg.user, bodyreg.auth);
			//evaluate
			user.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'post', undefined, 'no registration');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', undefined, 'registration ok');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'no registration');
		}
		//respond cordially
		res.status(code).send(toSend);
	});
 
	router.put('/',[isAuthWithoutOrga], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const user = await changeOrga.execute(req.body);
			//evaluate
			user.fold(error => {
				//something wrong
				code = 401;
				toSend = new RouterResponse('1.0', error as object, 'put', undefined, 'no change');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', undefined, 'change ok');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', undefined, 'no change');
		}
		//respond cordially
		res.status(code).send(toSend);
	});	

	///autenticación con google
	router.post('/withgoogle', async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {

			const bodyauth = req.body as {user:User, googleToken:string};

			const user = await getTokenGoogle.execute(bodyauth.user, bodyauth.googleToken);
			//evaluate
			user.fold(error => {
				//something wrong
				code = 401;
				toSend = new RouterResponse('1.0', error as object, 'post', undefined, 'no access');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', undefined, 'access ok');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'no access');
		}
		//respond cordially
		res.status(code).send(toSend);
	});


	return router;
}