import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MediasService {

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
  ) { }

  async create(createMediaDto: CreateMediaDto) : Promise<Media> {
    return await this.mediaRepo.save(createMediaDto);
  }

  async findAll() : Promise<Media[]> {
    return await this.mediaRepo.find();
  }

  async findOne(id: number) : Promise<Media | null> {
    const media = this.mediaRepo.findOneBy({ id: id });
    if (!media)
      throw new NotFoundException('Media non trouvé')

    return media
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    const updatemedia = this.mediaRepo.update(id, updateMediaDto);
    if (!updatemedia)
      throw new NotFoundException('Impossible de mettre à jour, média non trouvé');
    return updatemedia
  }

  async remove(id: number) : Promise<{message : string}>{
    const media = await this.mediaRepo.delete({ id: id });
    if(!media)
      throw new NotFoundException('Impossible de supprimer, média non trouvé');
    return {message : 'Media non trouvé'}
  }
}
