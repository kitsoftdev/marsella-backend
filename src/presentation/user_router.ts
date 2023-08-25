import express from 'express';
import { Request, Response } from 'express';
import { AddUserUseCase } from '../domain/usecases/users/add_user';
import { DeleteUserUseCase } from '../domain/usecases/users/delete_user';
import { EnableUserUseCase } from '../domain/usecases/users/enable_user';
import { GetUserUseCase } from '../domain/usecases/users/get_user';
import { GetUsersByOrgaIdUseCase } from '../domain/usecases/users/get_users_by_orga';
import { UpdateUserUseCase } from '../domain/usecases/users/update_user';
import { RouterResponse } from '../core/router_response';
import { isAuth } from '../core/presentation/valid_token_router';
import { hasRole } from '../core/presentation/check_role_router';
import { GetUsersNotInOrgaUseCase } from '../domain/usecases/users/get_users_notin_orga';
import { ExistsUserUseCase } from '../domain/usecases/users/exists_user';

export default function UsersRouter(
	getUser: GetUserUseCase,
	getUsersByOrgaId: GetUsersByOrgaIdUseCase,
	addUser: AddUserUseCase,
	updateUser: UpdateUserUseCase,
	enableUser: EnableUserUseCase,
	deleteUser: DeleteUserUseCase,
	getUsersNotInOrga: GetUsersNotInOrgaUseCase,
	existsUser: ExistsUserUseCase
) {
	const router = express.Router();

	router.get('/:id', async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const user = await getUser.execute(req.params.id);
			//evaluate
			user.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error, 'get', {id: req.params.id} as object, 'not obtained');	
			}, value => {
				//isOK
				if(value.currentItemCount > 0)
				{
					code = 200;
					toSend = new RouterResponse('1.0', value, 'get', {id: req.params.id} as object, 'geted by id');
				}
				else
				{
				//no encontrado
					code = 404;
					toSend = new RouterResponse('1.0', new Error('not found'), 'get', {id: req.params.id} as object, 'not obtained');		
				}
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {id: req.params.id} as object, 'not obtained');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/byorga/:orgaId', async (req: Request<{orgaId:string, searchtext: string, sort: string, pageindex: string, pagesize:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//parameters settings
			let valid_sort: [string, 1 | -1][] | undefined;
			if(req.query.sort)
			{
				valid_sort = JSON.parse(req.query.sort.toString());
			}
			let pageIndex:number | undefined;
			let pageSize:number | undefined;

			if(req.query.pageindex)
				pageIndex = Number(req.query.pageindex);
			if(req.query.pagesize)
				pageSize = Number(req.query.pagesize);

			//execution
			const users = await getUsersByOrgaId.execute((req.query.searchtext!=undefined)?req.query.searchtext.toString():'', req.params.orgaId, valid_sort, pageIndex, pageSize);
			//evaluate
			users.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', {orgaId: req.params.orgaId} as object, 'not obtained by orga id');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {orgaId: req.params.orgaId} as object, 'geted by orga id');				
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {orgaId: req.params.orgaId} as object, 'not obtained by orga id');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/notinorga/:orgaId', async (req: Request<{orgaId:string, searchtext: string, sort: string, pageindex: string, pagesize:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//parameters settings
			let valid_sort: [string, 1 | -1][] | undefined;
			if(req.query.sort)
			{
				valid_sort = JSON.parse(req.query.sort.toString());
			}
			let pageIndex:number | undefined;
			let pageSize:number | undefined;

			if(req.query.pageindex)
				pageIndex = Number(req.query.pageindex);
			if(req.query.pagesize)
				pageSize = Number(req.query.pagesize);

			//execution
			const users = await getUsersNotInOrga.execute((req.query.searchtext!=undefined)?req.query.searchtext.toString():'', req.params.orgaId, valid_sort, pageIndex, pageSize);
			//evaluate
			users.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', {orgaId: req.params.orgaId} as object, 'not obtained not in orga');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {orgaId: req.params.orgaId} as object, 'geted not in orga');				
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {orgaId: req.params.orgaId} as object, 'not obtained not in orga');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.post('/',[isAuth, hasRole(['admin', 'super'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const user = await addUser.execute(req.body);
			//evaluate
			user.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'post', undefined, 'user was not added');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'post', undefined, 'new user added');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'post', undefined, 'user was not added');
		}
		//respond cordially
		res.status(code).send(toSend);
	});
	
	router.put('/:id',[isAuth, hasRole(['admin', 'super'])], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			//execution
			const user = await updateUser.execute(req.params.id, req.body);
			//evaluate
			user.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.id}, 'user was not edited');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {id: req.params.id}, 'user edited');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.id}, 'user was not edited');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.put('/enable/:id',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{id:string}>, res: Response) => {
		const text = (req.query.enable === 'false' ? false : true) ? 'enabled' : 'disabled';
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			//execution
			const result = await enableUser.execute(req.params.id, (req.query.enable === 'false' ? false : true));
			//evaluate
			result.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.id, enable: req.query.enable}, 'user was not ' + text);	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {id: req.params.id, enable: req.query.enable}, 'user ' + text);
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.id, enable: req.query.enable}, 'user was not ' + text);
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.delete('/:id',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{id:string}>, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();			
		try {
			//execution
			const result = await deleteUser.execute(req.params.id);
			//evaluate
			result.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'delete', {id: req.params.id}, 'user was not deleted');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'delete', {id: req.params.id}, 'user deleted');
			});

		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'delete', {id: req.params.id}, 'user was not deleted');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/if/exists/',[isAuth, hasRole(['admin', 'super'])], async (req: Request<{userId:string,username:string,email:string}>, res: Response) => {	
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const users = await existsUser.execute(
				(req.query.userId!=undefined)?req.query.userId.toString():'',
				(req.query.username!=undefined)?req.query.username.toString():'',
				(req.query.email!=undefined)?req.query.email.toString():'');
			//evaluate
			users.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', {userId: req.params.userId} as object, 'not obtained if exists');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {userId: req.params.userId} as object, 'geted if exists');				
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {userId: req.params.userId} as object, 'not obtained if exists');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.put('/profile/:id',[isAuth], async (req: Request, res: Response) => {
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();		
		try {
			if(req.params.id !== req.params.r_userId)
			{
				code = 401;
				toSend = new RouterResponse('1.0', new Error('user not allowed'), 'put', {id: req.params.id}, 'user was not edited');
				res.status(code).send(toSend);
				return;
			}
			//execution
			const user = await updateUser.execute(req.params.id, req.body);
			//evaluate
			user.fold(error => {
			//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'put', {id: req.params.id}, 'user was not edited');	
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'put', {id: req.params.id}, 'user edited');
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'put', {id: req.params.id}, 'user was not edited');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	router.get('/if/exists/profile/',[isAuth], async (req: Request<{username:string,email:string, r_userId:string}>, res: Response) => {	
		//definitions
		let code = 500;
		let toSend = RouterResponse.emptyResponse();
		try {
			//execution
			const users = await existsUser.execute(
				req.params.r_userId.toString(),
				(req.query.username!=undefined)?req.query.username.toString():'',
				(req.query.email!=undefined)?req.query.email.toString():'');
			//evaluate
			users.fold(error => {
				//something wrong
				code = 500;
				toSend = new RouterResponse('1.0', error as object, 'get', {} as object, 'not obtained if exists');
			}, value => {
				code = 200;
				toSend = new RouterResponse('1.0', value, 'get', {} as object, 'geted if exists');				
			});
		} catch (err) {
			//something wrong
			code = 500;
			toSend = new RouterResponse('1.0', err as object, 'get', {} as object, 'not obtained if exists');
		}
		//respond cordially
		res.status(code).send(toSend);
	});

	return router;
}