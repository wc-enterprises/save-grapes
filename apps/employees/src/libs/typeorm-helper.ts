import 'reflect-metadata';
import {
  ObjectLiteral,
  EntityTarget,
  DataSource,
  DataSourceOptions,
} from 'typeorm';
import { pascalCaseToSnakeCase } from '../app/utils/utils';

export class EmployeeManagementRepository {
  static getProvider<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>
  ) {
    return {
      provide: EmployeeManagementRepository.getName(entity),
      useFactory: (dataSource: DataSource) => dataSource.getRepository(entity),
      inject: ['DATA_SOURCE'],
    };
  }

  static getName<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>) {
    return pascalCaseToSnakeCase(entity['name']).toUpperCase();
  }

  static generateDataSources = (options: DataSourceOptions[]) => {
    return options.map((v) => {
      return {
        provide: 'DATA_SOURCE',
        useFactory: () => new DataSource(v).initialize(),
      };
    });
  };
}
