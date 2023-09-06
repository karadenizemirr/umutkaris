import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { join } from 'path';
import { AppDataSource } from './customService/mysql.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  AppDataSource.initialize().then(() => console.log('Database connected')).catch(() => console.log('Database connection failed'))
  app.useStaticAssets({
    root: join(__dirname, '..', 'src/assets/public'),
    prefix: '/public/',
  });
  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '..', 'src/assets/pages'),
    layout:'partials/layout'
  });
  await app.listen(3000);
}
bootstrap();