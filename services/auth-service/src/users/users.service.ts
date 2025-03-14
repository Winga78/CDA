import { ConflictException, Injectable, NotFoundException , BadRequestException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) : Promise<Omit<User, "password">> {
    const existingUser = await this.userModel.findOne({email : createUserDto.email}).exec();
    if(existingUser){
      throw new ConflictException('Un utilisateur avec cet email exite déjà')
    }

    
    const createdUser = new this.userModel(createUserDto);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!createdUser.email || !emailRegex.test(createUserDto.email)){
      throw new BadRequestException('Email invalide');
    }
    const saltOrRounds =  await bcrypt.genSalt();
   
    createdUser.password = await bcrypt.hash(createdUser.password, saltOrRounds);
    createdUser.role = 'user'
    createdUser.createdAt = new Date();

    const savedUser = await createdUser.save();

    const { password, ...userWithoutPassword } = savedUser.toObject();
 
    return userWithoutPassword;
  }

  async findAll() : Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {

    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID invalide');
    } 

    const user = await this.userModel.findOne({ _id: new Types.ObjectId(id) });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    
   return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if(!user)
      throw new NotFoundException('Utilisateur non trouvé')
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) : Promise<User | null> {

    const existingUser = await this.userModel.findById(id);
      // const updateUser = this.userModel.findByIdAndUpdate(id, updateUserDto);
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!existingUser)
        throw new NotFoundException('Impossible de mettre à jour, utilisateur non trouvé');
    
      if (updateUserDto.email && !emailRegex.test(updateUserDto.email)) {
        throw new BadRequestException("Email invalide");
      }

      if (updateUserDto.email) {
        const emailExists = await this.userModel.findOne({ email: updateUserDto.email });
        if (emailExists && emailExists.id !== id) {
          throw new ConflictException("Cet email est déjà utilisé");
        }
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
      return updatedUser
  }

  async remove(id: string) : Promise<{message : string}> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID invalide');
    } 
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(id) });
    if (!user)
      throw new NotFoundException('Impossible de supprimer, utilisateur non trouvé');

    await this.userModel.deleteOne({ _id: id });
    
     return {message : 'Utilisateur supprimé avec succès'}
  }
}
