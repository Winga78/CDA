import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination : (req , file , callback)=>{
        const uploadPath = './uploads';
        callback(null, uploadPath);
      },
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),

    limits: { fileSize: 40 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
      const allowedMimes = ['image/png', 'image/jpeg', 'image/gif'];
      if (['image/png', 'image/jpeg', 'image/gif'].includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Seuls les fichiers PNG, JPEG et GIF sont autorisés'), false);
      }
    },
    
  }))
 async create(@Body() createMediaDto: CreateMediaDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier envoyé');
    }
   
    const media = await this.mediasService.create({
      comment_id: createMediaDto.comment_id,
      po_id : createMediaDto.po_id,
      name : file.fieldname,
      type : file.mimetype,
      path : './uploads',
      size: file.size.toString(),
      createdAt: new Date(),
      modifiedAt : new Date()
    });
 

    return { message: 'Fichier uploadé avec succès', media };

  }

  @Get()
  findAll() {
    return this.mediasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediasService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediasService.remove(+id);
  }
}
