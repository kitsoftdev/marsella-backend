import jwt from 'jsonwebtoken';

export const generateJWT = (payload: object, secretKey:string, secondsToExpire: number):string =>
{
	const token = jwt.sign(payload, secretKey, {expiresIn: secondsToExpire});
	return token;
};

export const validJWT = (token: string, secretKey:string): undefined | {userId: string, roles:string, orgaId:string} =>
{
	if(!isTokenExpired(token))
	{
		const payload = jwt.verify(token, secretKey);
		return payload as {userId: string, roles:string, orgaId:string};
	}
	else
		return undefined;
};

export const isTokenExpired = (token: string): boolean => {
	try {
		const { exp } = jwt.decode(token) as {
            exp: number;
        };
		const expirationDatetimeInSeconds = exp * 1000;
		return Date.now() >= expirationDatetimeInSeconds;
	} catch {
		return true;
	}
};