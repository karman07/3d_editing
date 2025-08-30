import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ModelsModule } from './models/models.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { RevisionsModule } from './revisions/revisions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI') || 'mongodb://localhost:27017/3dmodelsdb',
      }),
    }),

    AuthModule,
    UsersModule,
    ModelsModule,
    AssignmentsModule,
    RevisionsModule,
  ],
})
export class AppModule {}
