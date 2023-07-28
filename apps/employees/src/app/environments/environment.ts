import { DataSourceOptions } from 'typeorm';
import 'reflect-metadata';
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
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'employee-management-application',
  entities: [...entitiesToInject],
  synchronize: true,
};

export const environment = {
  production: false,
  databaseConfig: postgresConfig,
  dataSources: EmployeeManagementRepository.generateDataSources([
    postgresConfig,
  ]),
  entityProviders: entitiesToInject.map((v) =>
    EmployeeManagementRepository.getProvider(v)
  ),
};
