import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) : Promise<User> {
    const existingUser = await this.userModel.findOne({email : createUserDto.email}).exec();
    if(existingUser){
      throw new ConflictException('Un utilisateur avec cet email exite déjà')
    }
    const createdUser = new this.userModel(createUserDto);
    const saltOrRounds =  await bcrypt.genSalt();;
    const password = createdUser.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    
    createdUser.password = hash
    createdUser.role = 'user'
    createdUser.createdAt = new Date();
 
    return createdUser.save();
  }

  async findAll() : Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    const user= this.userModel.findOne({_id : id});
    if(!user)
      throw new NotFoundException('Utiliateur non trouvé')
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user= await this.userModel.findOne({email : email});
    if(!user)
      throw new NotFoundException('Utiliateur non trouvé')
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) : Promise<User | null> {
      const updateUser = this.userModel.findByIdAndUpdate(id, updateUserDto);
      if (!updateUser)
        throw new NotFoundException('Impossible de mettre à jour, l\'utilisateur non trouvé');
      return updateUser
  }

  async remove(id: string) : Promise<{message : string}> {
    const user = await this.userModel.deleteOne({_id : id});
    if (!user)
      throw new NotFoundException('Impossible de supprimer, l\'utilisateur non trouvé');
     return {message : 'Utilisateur supprimé avec succès'}
  }
}
