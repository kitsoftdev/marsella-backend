import { Either } from '../../../core/either';
import { Failure } from '../../../core/errors/failures';
import { ModelContainer } from '../../../core/model_container';
import { CloudFile } from '../../entities/storage/cloudfile';
import { StorageRepository } from '../../repositories/storage_repository';

export interface UploadUserPictureUseCase {
    execute(cloudFileId:string, dataBytes:Buffer): Promise<Either<Failure, ModelContainer<CloudFile>>>;
}

export class UploadUserPicture implements UploadUserPictureUseCase {
	repository: StorageRepository;
	constructor(repository: StorageRepository) {
		this.repository = repository;
	}

	async execute(cloudFileId:string, dataBytes:Buffer): Promise<Either<Failure,ModelContainer<CloudFile>>> {
		return await this.repository.uploadUserPicture(cloudFileId, dataBytes);
	}
}