import { NextFunction, Request, Response } from 'express';
import { RouterResponse } from '../router_response';

export const hasRole = (roles:string[]) => {
	return (req: Request, res: Response, next:NextFunction) => {
		if(!req.params.r_userId)
			return res.status(403).send(new RouterResponse('1.0', 'forbidden', 'get', {} as object, 'forbidden'));

		let getout = true;

		roles.forEach(role => {
			if(req.params.r_roles.includes(role))
				getout = false;
		});

		if(getout)
			return res.status(403).send(new RouterResponse('1.0', 'forbidden', 'get', {} as object, 'forbidden'));

		next();
	}; 
};