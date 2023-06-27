import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
// import { MorganMiddleware } from '@nest-middlewares/morgan';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import configuration from './config/configuration';
import { GraphqlModule } from './graphql/graphql.module';
import { MorganMiddleware } from './middlewares/morgan.middleware';
import { ProductsModule } from './products/products.module';
import * as express from 'express';
// import { CloudinaryModule } from './cloudinary/cloudinary.module';
import * as multer from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MulterModule.register({
      dest: './uploads', // Carpeta donde se guardarán los archivos cargados
    }),
    GraphqlModule,
    MongooseModule.forRoot(process.env.MONGODB),
    AuthModule,
    UsersModule,
    PostsModule,
    ProductsModule,
    /* CloudinaryModule */
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
    const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // Ajusta el límite según tus necesidades

    consumer.apply(express.json()).forRoutes('*');

    consumer
      .apply(upload.single('file')) // Asegúrate de que coincida con el nombre del campo de archivo en tu mutación
      .forRoutes('*');
  }
}
