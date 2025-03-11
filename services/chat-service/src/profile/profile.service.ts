import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class ProfileService {
    constructor(
        private readonly httpService: HttpService
      ) {}

    async userProfile(token: any): Promise<{id : string , email : string , role : string}>{

        try {
          const response = await lastValueFrom(
            this.httpService.get('http://localhost:3000/auth/profile', {
              headers: {
                Authorization : `${token}`
              }
            })
          );
          const data= response.data
          return {id : data.id , email : data.email , role : data.role} ;
           
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          throw error;
        }
      }
    
}
