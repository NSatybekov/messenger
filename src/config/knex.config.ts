import { KnexModuleOptions } from 'nest-knexjs';

export const knexConfig: KnexModuleOptions = {
  config: {
    client: 'pg',
    version: '13',
    connection: {
      host: process.env.DB_HOST,
      user: 'postgres',
      password: '123',
      database: 'nest',
      port: 5434,
    },
    migrations: {
      directory: './migrations',
    },
  },
};
