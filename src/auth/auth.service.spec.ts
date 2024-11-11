import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashedSecretKey'), // Mock hash function
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Partial<UserRepository>;

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn().mockImplementation((user) => user), // Mock create method
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: userRepository },
        { provide: JwtService, useValue: { sign: jest.fn() } },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should throw an error if user with the email already exists', async () => {
    const signUpDto = {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      phonenumber: '123456789',
      password: 'password',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue({ email: 'test@example.com' } as any);

    await expect(authService.signUp(signUpDto)).rejects.toThrow(
      new BadRequestException('User with this email already exist'),
    );
  });

  it('should create a new user if email is not taken', async () => {
    const signUpDto = {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      phonenumber: '123456789',
      password: 'password',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'save').mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    } as any);

    const result = await authService.signUp(signUpDto);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email', 'test@example.com');
  });
});
