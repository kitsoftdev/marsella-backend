import crypto from 'crypto';

export class HashPassword {
	static isValidPassword(hash:string, salt:string, password:string):boolean {
		const calculatedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
		return hash === calculatedHash;    
	}
	static createHash(password:string, previousSalt?:string):{hash:string, salt:string} {
		const salt = previousSalt == undefined ? crypto.randomBytes(16).toString('hex') : previousSalt;
		const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex'); 
        
		return {hash, salt}; 
	}
}