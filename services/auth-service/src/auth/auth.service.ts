
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
      ) {}

  async signIn(email: string, pass: string ,res :any): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    const isMatch = await bcrypt.compare(pass, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    const payload = { id: user['_id'] , email: user.email , firstname : user.firstname , lastname : user.lastname , birthday : user.birthday};
    const token =  await this.jwtService.signAsync(payload);
    res.cookie('cookieAuth', token, {
      httpOnly: true,
      maxAge: 3600000,
      //secure: process.env.NODE_ENV === 'production',
      // sameSite: 'lax',
    })
    return {
      access_token: token
    };
  }
}
