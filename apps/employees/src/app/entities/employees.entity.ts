import 'reflect-metadata';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { EmployeeManagementRepository } from '../../libs/typeorm-helper';

@Entity('employees')
export class Employees extends BaseEntity {
  @PrimaryColumn({ name: 'employee_id', type: 'text' })
  employeeId: string;

  @Column({ name: 'first_name', type: 'text' })
  firstName: string;

  @Column({ name: 'middle_name', type: 'text' })
  middleName: string;

  @Column({ name: 'sur_name', type: 'text' })
  surName: string;

  @Column({ name: 'dob', type: 'text' })
  dob: string;

  @Column({ name: 'address_id', type: 'text' })
  addressId: string;

  @Column({ name: 'phone_number', type: 'text' })
  phoneNumber: string;

  @Column({ name: 'role_id', type: 'text' })
  roleId: string;

  @Column({ name: 'team_id', type: 'text' })
  teamId: string;

  @Column({ name: 'status', type: 'text' })
  status: string;

  @Column({ name: 'sex', type: 'text' })
  sex: string;

  @Column({ name: 'blood_group', type: 'text' })
  bloodGroup: string;

  @Column('varchar', { array: true, nullable: true })
  documentIds: string[];
}

@Entity('address')
export class Address extends BaseEntity {
  @PrimaryColumn({ name: 'address_id', type: 'text' })
  addressId: string;

  @Column({ name: 'address_line_1', type: 'text' })
  addressLine1: string;

  @Column({ name: 'address_line_2', type: 'text' })
  addressLine2: string;

  @Column({ name: 'address_line_3', type: 'text' })
  addressLine3: string;

  @Column({ name: 'district', type: 'text' })
  district: string;

  @Column({ name: 'country', type: 'text' })
  country: string;

  @Column({ name: 'postal_code', type: 'text' })
  postalCode: number;
}

@Entity('role')
export class Role extends BaseEntity {
  @PrimaryColumn({ name: 'role_id', type: 'text' })
  roleId: string;

  @Column({ name: 'name', type: 'text' })
  name: string;
}

@Entity('role_history')
export class RoleHistory extends BaseEntity {
  @PrimaryColumn({ name: 'role_history_id', type: 'text' })
  roleHistoryId: string;

  @Column({ name: 'role_id', type: 'text' })
  roleId: string;

  @Column({ name: 'employee_id', type: 'text' })
  employeeId: string;

  @Column({ name: 'start_date', type: 'timestamptz' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date;
}

@Entity('team')
export class Team extends BaseEntity {
  @PrimaryColumn({ name: 'team_id', type: 'text' })
  teamId: string;

  @Column({ name: 'name', type: 'text' })
  name: string;
}

@Entity('team_history')
export class TeamHistory extends BaseEntity {
  @PrimaryColumn({ name: 'team_history_id', type: 'text' })
  teamHistoryId: string;

  @Column({ name: 'team_id', type: 'text' })
  teamId: string;

  @Column({ name: 'employee_id', type: 'text' })
  employeeId: string;

  @Column({ name: 'start_date', type: 'timestamptz' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamptz' })
  endDate: Date;
}

@Entity('document')
export class Document extends BaseEntity {
  @PrimaryColumn({ name: 'document_id', type: 'text' })
  documentId: string;

  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'url', type: 'text' })
  url: string;

  @Column({ name: 'type', type: 'text' })
  type: string;
}

export const employeesInfo = {
  employees: EmployeeManagementRepository.getName(Employees),
  address: EmployeeManagementRepository.getName(Address),
  role: EmployeeManagementRepository.getName(Role),
  roleHistory: EmployeeManagementRepository.getName(RoleHistory),
  team: EmployeeManagementRepository.getName(Team),
  teamHistory: EmployeeManagementRepository.getName(TeamHistory),
  document: EmployeeManagementRepository.getName(Document),
};
