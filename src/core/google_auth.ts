import firebase from 'firebase-admin';

interface ExternalAuth
{
    isValid(googleToken:string):Promise<boolean>;
}

export class GoogleAuth implements ExternalAuth
{
	firebaseGoogleApp: firebase.app.App;
	constructor(googleApp: firebase.app.App){
		this.firebaseGoogleApp = googleApp;
	}

	async isValid(googleToken:string): Promise<boolean> {

		const gauth = this.firebaseGoogleApp.auth();
		const googleVerify = await gauth.verifyIdToken(googleToken);

		return !(googleVerify.id == '');
	}
}