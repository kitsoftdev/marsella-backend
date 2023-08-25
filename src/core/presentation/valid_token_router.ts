import { Request, Response, NextFunction } from 'express';
import { RouterResponse } from '../router_response';
import { validJWT } from '../jwt';
import { configEnv } from '../../config_env';


export const isAuth = async (req: Request, res: Response, next:NextFunction) => {
	const authorization = req.header('Authorization')?.toString();
	//si la cabecera no viene o ésta no incluye un espacio en medio entonces
	//es inválida y se rechaza solicitud.
	//Se espera que en la cabcera venga un texto como el siguiente:
	// "Bearer zTyfGtw2...er4eWqAf"
	if(!authorization || authorization.indexOf(' ') < 0)
		return res.status(401).send(new RouterResponse('1.0', 'not authorized', 'get', {id: req.params.id} as object, 'not authorized'));

	const token = authorization.split(' ')[1].toString();

	const validToken = validJWT(token, configEnv().SECRET_KEY);
	if(!validToken)
		return res.status(401).send(new RouterResponse('1.0', 'not authorized', 'get', {} as object, 'not authorized'));

	if(validToken.orgaId == '')
		return res.status(406).send(new RouterResponse('1.0', 'not authorized', 'get', {} as object, 'no organization'));

	req.params.r_userId = validToken.userId;
	req.params.r_orgaId = validToken.orgaId;
	req.params.r_roles = validToken.roles;
	next();
};

export const isAuthWithoutOrga = async (req: Request, res: Response, next:NextFunction) => {
	const authorization = req.header('Authorization')?.toString();
	//si la cabecera no viene o ésta no incluye un espacio en medio entonces
	//es inválida y se rechaza solicitud.
	//Se espera que en la cabcera venga un texto como el siguiente:
	// "Bearer zTyfGtw2...er4eWqAf"
	if(!authorization || authorization.indexOf(' ') < 0)
		return res.status(401).send(new RouterResponse('1.0', 'not authorized', 'get', {id: req.params.id} as object, 'not authorized'));

	const token = authorization.split(' ')[1].toString();

	const validToken = validJWT(token, configEnv().SECRET_KEY);
	if(!validToken)
		return res.status(401).send(new RouterResponse('1.0', 'not authorized', 'get', {} as object, 'not authorized'));

	req.params.r_userId = validToken.userId;
	req.params.r_orgaId = '';
	req.params.r_roles = '';
	next();
};