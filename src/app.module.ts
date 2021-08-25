import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { PetsController } from './pets/pets.controller';
import { CitiesController } from './cities/cities.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'docs'),
    }),
  ],
  controllers: [AppController, HealthController, PetsController, CitiesController],
  providers: [AppService],
})
export class AppModule {}
