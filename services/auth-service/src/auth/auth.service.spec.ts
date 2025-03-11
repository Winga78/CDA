import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
describe('AuthService', () => {
  let authService: AuthService;
  const jwtServiceMock = {
    signAsync: jest.fn(),
};
  const usersServiceMock = {
    validateCredentials: jest.fn(),
    create: jest.fn(),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock, // Utilisation correcte
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

  });

  it('should sign in a user and return an access token', async () => {
    const user = {
        id: '1',
        email: 'testuser',
        password: 'password',
    };

    usersServiceMock.validateCredentials.mockResolvedValueOnce(user);
    jwtServiceMock.signAsync.mockResolvedValueOnce('token');

    const response = await authService.signIn('testuser', 'password');

    expect(response).toEqual({ access_token: 'token' });
});

it('should throw an UnauthorizedException if the user cannot be signed in', async () => {
  usersServiceMock.validateCredentials.mockResolvedValueOnce(null);

  await expect(
      authService.signIn('testuser', 'password'),
  ).rejects.toThrowError(UnauthorizedException);
});

});
