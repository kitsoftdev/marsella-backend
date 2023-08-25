import { Either } from '../../core/either';
import { Failure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { User } from '../entities/user';

export interface UserRepository {
    getUsersByOrgaId(searchText: string, orgaId: string, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<User>>>;
    getUsersNotInOrga(searchText: string, orgaId: string, sort?: [string, 1 | -1][], pageIndex?: number, itemsPerPage?: number): Promise<Either<Failure, ModelContainer<User>>>;
    getUser(id: string): Promise<Either<Failure, ModelContainer<User>>>;
    addUser(id: string, name: string, username: string, email: string,
		enabled: boolean, builtIn: boolean) : Promise<Either<Failure, ModelContainer<User>>>;
    updateUser(id: string, user: User) : Promise<Either<Failure, ModelContainer<User>>>;
    enableUser(id: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>>;
    deleteUser(id: string): Promise<Either<Failure,boolean>>;
    existsUser(userId: string, username: string, email: string): Promise<Either<Failure, ModelContainer<User>>>;
}