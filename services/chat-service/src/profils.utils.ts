// profile.utils.ts
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

export async function userProfile(httpService: HttpService, token: string): Promise<{ id: string; email: string; role: string }> {
  try {
    const response: any = await lastValueFrom(
      httpService.get('http://localhost:3000/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
    const data = response.data;
    return { id: data.id, email: data.email, role: data.role };
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error;
  }
}
