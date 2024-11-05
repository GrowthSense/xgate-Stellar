import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const config=new DocumentBuilder()
  .setTitle('Xgate Pay')
  .setDescription('Xgate pay api')
  .setVersion('1.0')
  .addTag('xGate')
  .addBearerAuth(
    {
      type:'http',
      scheme:'bearer',
      bearerFormat:'JWT',
      name:'JWT',
      description:'Enter the token here:',
      in:'header'
    }
  )
  .build()

  const document=SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document)

  const configService:ConfigService=app.get(ConfigService);

  await app.listen(configService.get("PORT","0.0.0.0"))
  console.log("Listening on port:" +configService.get("PORT"))
}
bootstrap();
