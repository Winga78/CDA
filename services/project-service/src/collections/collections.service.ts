import { Injectable , NotFoundException , ConflictException} from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { UpdateResult } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import {lastValueFrom} from 'rxjs';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class CollectionsService {

  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepo: Repository<Collection>,
    private readonly httpService: HttpService,
    private readonly profileService : ProfileService
  ) { }
  
  async create(authHeader : string ,createCollectionDto: CreateCollectionDto) : Promise<Collection> {
   
    const existingCollection = await this.collectionRepo.findOneBy({ name: createCollectionDto.name });

        if (existingCollection) {
          throw new ConflictException('Une collection avec ce nom existe déjà');
        }
        const user = await this.profileService.userProfile(authHeader);
        const createCollection : CreateCollectionDto = {
          user_id : user.id,
          name : createCollectionDto.name,
          createdAt : new Date(),
          modifiedAt : new Date()
        }
    return await this.collectionRepo.save(createCollection);
  }

  async findAll() : Promise<Collection[]> {
    return await this.collectionRepo.find();
  }

  async findOne(id: number) : Promise<Collection | null> {
    return this.collectionRepo.findOneBy({id: id })
  }

  async update(id: number, updateCollectionDto: UpdateCollectionDto) : Promise<UpdateResult>{
    const collection = await this.collectionRepo.update(id, updateCollectionDto);

    if (!collection)
      throw new NotFoundException('Impossible de mettre à jour, collection non trouvé'); 

    return collection
  }

  async remove(id: number) : Promise<{message : string}> {
    const collection = await this.collectionRepo.delete({ id: id });
    if (!collection)
      throw new NotFoundException('Impossible de supprimer, l\'utilisateur non trouvé');
    return {message : 'collection supprimé avec succès'}
  }

}
