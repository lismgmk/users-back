import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

import { AppModule } from './app.module';
import { CommonErrorFilter } from './exceptions/common-error-filter';
import { useContainer } from 'class-validator';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/.netlify/functions/serverless');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();
  app.useGlobalFilters(new CommonErrorFilter());
  app.use(cookieParser());
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};

// import { NestFactory } from '@nestjs/core';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import { useContainer } from 'class-validator';
// import cookieParser from 'cookie-parser';
// import express from 'express';
// import { Application } from 'express';
// import serverless from 'serverless-http';
// import { AppModule } from './app.module';
// import { CommonErrorFilter } from './exceptions/common-error-filter';

// const bootstrap = async (module: any) => {
//   const app = express();
//   const nestApp = await NestFactory.create(module, new ExpressAdapter(app));

//   nestApp.setGlobalPrefix('/.netlify/functions/server');
//   useContainer(nestApp.select(AppModule), { fallbackOnErrors: true });
//   nestApp.enableCors();
//   nestApp.useGlobalFilters(new CommonErrorFilter());
//   app.use(cookieParser());
//   await nestApp.init();
//   return app;
// };

// let cachedHadler: any;
// const proxyApi = async (module: any, event: any, context: any) => {
//   if (!cachedHadler) {
//     const app = await bootstrap(module);
//     cachedHadler = serverless(app as Application);
//   }

//   return cachedHadler(event, context);
// };

// export const handler = async (event: any, context: any) =>
//   proxyApi(AppModule, event, context);
