import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {setupSwagger} from './config/swagger.config'
import CorsConfig from './config/cors.config'
const cluster = require('cluster');
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({whitelist: true})); 
  app.enableCors(CorsConfig)
  setupSwagger(app)
  await app.listen(3000);
}

if (cluster.isMaster) {//if (cluster.isMaster) block should only be executed once in the master process, which is responsible for forking the worker processes.
//  In the master process, we don't want to call bootstrap() directly, because that would start a new NestJS application in the master proces 
  const numWorkers = os.cpus().length;
  console.log(`Number of workers ${numWorkers}`);
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is working`);
  });
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  bootstrap();
}