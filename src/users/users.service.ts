import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async createUser(email: string, password: string) {
    return this.prismaService.user.create({ data: { email, password } });
  }
  async getAllUser() {
    return this.prismaService.user.findMany();
  }
  async findOne(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }
  async updateUser(id: number, attar: Partial<User>) {
    const user = this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not founs');
    }
    return this.prismaService.user.update({ where: { id }, data: attar });
  }
  async removeUser(id: number) {
    const user = this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.prismaService.user.delete({ where: { id } });
  }

  async importUsersFromExternalApi() {
    try {
      const { data: externalUsers } = await axios.get(
        'https://jsonplaceholder.typicode.com/users',
      );

      for (const user of externalUsers) {
        await this.prismaService.user.upsert({
          where: { email: user.email }, // קריטריון ייחודי
          update: {
            password: 'external', // סיסמה דמה כי אין להם סיסמה
          },
          create: {
            email: user.email,
            password: 'external',
          },
        });
      }

      return { message: 'Users imported successfully' };
    } catch (err) {
      console.error(err);
      throw new Error('Failed to import users');
    }
  }
  async OnModuleInit() {
    console.log('UsersService loaded – importing users...');
    await this.importUsersFromExternalApi();
  }
}
