import {
  IAddress,
  IDocument,
  IEmployeeDetails,
} from '../../interfaces/emloyees.interfaces';
import { _removeNullAndUndefinedValuesFromObject, responseObj } from '../utils';
import fastify from 'fastify';

const server = fastify({
  logger: true,
});
const mandatoryParamsOfAddress = [
  'addressLine1',
  'city',
  'country',
  'postalCode',
];
const mandatoryParamsOfDocument = ['name', 'description', 'url'];

function validateDocuments(document: IDocument) {
  for (const documentProperty of mandatoryParamsOfDocument) {
    if (!document.hasOwnProperty(documentProperty)) {
      throw new Error(
        `Mandatory param is missing in documents: Expecting ${documentProperty}`
      );
    }
  }
}

function validateAddress(address: IAddress) {
  for (const addressProperty of mandatoryParamsOfAddress) {
    if (!address.hasOwnProperty(addressProperty)) {
      throw new Error(
        `Mandatory param is missing in address: Expecting ${addressProperty}`
      );
    }
  }
}

function validatedEmployeeDetails(data: IEmployeeDetails) {
  const validatedEmployeeDetails = _removeNullAndUndefinedValuesFromObject({
    employeeId: data.employeeId,
    firstName: data.firstName,
    middleName: data.middleName,
    surName: data.surName,
    dob: data.dob,
    address: _removeNullAndUndefinedValuesFromObject(data.address),
    phoneNumber: data.phoneNumber,
    role: _removeNullAndUndefinedValuesFromObject(data.role),
    sex: data.sex,
    bloodGroup: data.bloodGroup,
    documents: data.documents,
    joiningDate: data.joiningDate,
    status: data.status,
  });
  return validatedEmployeeDetails;
}

export function validateCreateEmployeeData(data: IEmployeeDetails) {
  try {
    const mandatoryParamsOfEmployee = [
      'employeeId',
      'firstName',
      'middleName',
      'surName',
      'dob',
      'address',
      'phoneNumber',
      'role',
      'sex',
      'bloodGroup',
      'documents',
      'joiningDate',
    ];

    for (const createEmployeeProperty of mandatoryParamsOfEmployee) {
      if (!data.hasOwnProperty(createEmployeeProperty)) {
        throw new Error(
          `Mandatory params are missing: Expecting ${createEmployeeProperty}`
        );
      }

      switch (createEmployeeProperty) {
        case 'address':
          {
            validateAddress(data.address);
          }
          break;
        case 'role':
          {
            if (!data.role.name)
              throw `Mandatory params are missing in role: Expecting name.`;
          }
          break;
        case 'documents': {
          if (!data.documents.length)
            throw `Documemnts are missing: Expecting atleast one.`;
          for (const document of data.documents) {
            validateDocuments(document);
          }
        }
      }
    }
    return validatedEmployeeDetails({ ...data, ...{ status: 'WORKING' } });
  } catch (err) {
    server.log.error(
      `Errored while validating employee details with message: ${err}`
    );
    throw `Validation error: ${err}`;
  }
}

export function validateUpdateEmployeeData(data: IEmployeeDetails) {
  try {
    if (!data.employeeId)
      throw `Missing mandatory property: Expecting employeeId.`;
    if (data.address) {
      validateAddress(data.address);
    }
    if (data.role) {
      if (!data.role.name || !data.role.endDate)
        throw `Missing mandatory params in role: Expecting both name and endDate`;
    }
    if (data.documents) {
      for (let i = 0; i < data.documents.length; i++) {
        validateDocuments(data.documents[i]);
      }
    }
    return validatedEmployeeDetails(data);
  } catch (err) {
    server.log.error(
      `Errored while validating employee details with message: ${err}`
    );
    throw `Validation error: ${err}`;
  }
}
