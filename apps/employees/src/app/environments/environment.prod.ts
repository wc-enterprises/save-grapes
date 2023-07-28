import { DataSourceOptions } from 'typeorm';
import { EmployeeManagementRepository } from '../../libs/typeorm-helper';
import {
  Address,
  Document,
  Employees,
  Role,
  RoleHistory,
  Team,
  TeamHistory,
} from '../entities/employees.entity';

export const entitiesToInject = [
  Employees,
  Address,
  Role,
  RoleHistory,
  Team,
  TeamHistory,
  Document,
];

export const postgresConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  entities: [...entitiesToInject],
  synchronize: true,
};

export const environment = {
  production: true,
  databaseConfig: postgresConfig,
  dataSources: EmployeeManagementRepository.generateDataSources([
    postgresConfig,
  ]),
  entityProviders: entitiesToInject.map((v) =>
    EmployeeManagementRepository.getProvider(v)
  ),
};
