import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Auth } from '../entities/auth';
import { Token } from '../entities/token';
import { User } from '../entities/user';

export interface AuthRepository {
    getAuth(auth:Auth):Promise<Either<Failure,ModelContainer<Token>>>;
    registerUser(user:User, auth:Auth): Promise<Either<Failure,ModelContainer<User>>>;
    changeOrga(auth:Auth):Promise<Either<Failure,ModelContainer<Token>>>;
    getAuthGoogle(userToAuth:User, googleToken:string):Promise<Either<Failure,ModelContainer<Token>>>;
}