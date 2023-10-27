import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { publicSequelizeInstance } from './sequelize.config';
import * as winston from 'winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ERROR_LOGS_LOCATION, INFO_LOGS_LOCATION } from './shared/utils';
import helmet from 'helmet';
import * as csurf from 'csurf';
import rateLimit from 'express-rate-limit';
// import * as bodyParser from 'body-parser';

const logger = winston.createLogger({
  level: 'verbose',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
  ),
  defaultMeta: { service: 'main.js' },
  transports: [
    new winston.transports.File({
      filename: ERROR_LOGS_LOCATION(),
      level: 'error',
    }),
    new winston.transports.File({ filename: INFO_LOGS_LOCATION() }),
  ],
});

async function bootstrap() {
  const port = process.env.PORT || 3000;
  try {
    // sequelize.Sequelize.sets
    await publicSequelizeInstance.sync({ alter: true });
  } catch (e) {
    console.error(e);
  }
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('BlogApp API Doc')
    .setDescription('The official API BlogApp Documentation')
    .setVersion('1.0')
    .addTag('BlogApp')
    .addBearerAuth({
      name: 'Authorization',
      type: 'http',
      bearerFormat: 'JWT',
      scheme: 'Bearer',
      in: 'header',
      description: `JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.`,
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
  app.use(helmet());
  app.use(csurf());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  // app.use(LoggerMiddleware);
  app.enableCors({
    origin: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  logger.info(`Application Started listening on port ${port}!`);
}
bootstrap();
