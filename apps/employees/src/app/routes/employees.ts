import 'reflect-metadata';
import fastify from 'fastify';
import { responseObj } from '../utils/utils';
import {
  Address,
  Document,
  Employees,
  Role,
  RoleHistory,
} from '../entities/employees.entity';
import { validateCreateEmployeeData } from '../utils/validators/employees.validator';
import { IEmployeeDetails } from '../interfaces/emloyees.interfaces';
import { generateIds } from '../utils/generators/id-generators';

const app = fastify();

export async function saveEmployeeDetailsWithGeneratedIdsInDb(
  employeeDetails: IEmployeeDetails,
  generatedIds: any
) {
  const addressDetails: Partial<Address> = {
    ...employeeDetails.address,
    ...{ addressId: generatedIds.addressId },
  };
  const roleDetails: Partial<Role> = {
    ...employeeDetails.role,
    ...{ roleId: generatedIds.roleId },
  };
  const roleHistoryDetails: Partial<RoleHistory> = {
    roleHistoryId: generatedIds.roleHistoryId,
    roleId: generatedIds.roleId,
    employeeId: employeeDetails.employeeId,
    startDate: employeeDetails.joiningDate,
  };
  let documentDetails = [];

  await Address.save(addressDetails);
  await Role.save(roleDetails);
  await RoleHistory.save(roleHistoryDetails);
  for (let i = 0; i < employeeDetails.documents.length; i++) {
    documentDetails.push({
      ...employeeDetails.documents[i],
      ...{ documentId: generatedIds.documentIds[i] },
    });
  }
  for (let i = 0; i < generatedIds.documentIds.length; i++) {
    await Document.save(documentDetails[i]);
  }
  return;
}

export default function employeeRoutes(server, options, done) {
  //Create new employee
  async function createEmployee(req, res) {
    try {
      const employeeDetails = validateCreateEmployeeData(
        req.body
      ) as IEmployeeDetails;

      const employeeId = employeeDetails.employeeId;
      const checkEmployeeExistence = await Employees.find({
        where: { employeeId },
      });

      if (checkEmployeeExistence.length != 0) {
        throw `Employee details available already.`;
      }
      let documentIds = [];
      for (let i = 0; i < employeeDetails.documents.length; i++) {
        let documentWithGeneratedId = {
          ...employeeDetails.documents[i],
          ...{ documentId: generateIds('DOCUMENT_ID') },
        };
        documentIds.push(documentWithGeneratedId.documentId);
      }

      const generatedIds = {
        addressId: generateIds('ADDRESS_ID'),
        roleId: generateIds('ROLE_ID'),
        roleHistoryId: generateIds('ROLE_HISTORY_ID'),
        documentIds,
      };

      console.log('generatedIds', generatedIds);

      const saveEmployeeDetailsWithGeneratedIds =
        saveEmployeeDetailsWithGeneratedIdsInDb(employeeDetails, generatedIds);

      delete employeeDetails.address;
      delete employeeDetails.role;
      delete employeeDetails.documents;

      const employeeDetailsWithGeneratedIds = {
        ...employeeDetails,
        ...{ addressId: generatedIds.addressId },
        ...{ roleId: generatedIds.roleId },
        ...{ documentIds: generatedIds.documentIds },
      };

      await Employees.save(employeeDetailsWithGeneratedIds);

      console.log('saveEmployeeDetails', saveEmployeeDetailsWithGeneratedIds);
      //   const savedEmployee = await Employees.save(employeeDetails);
      //   console.log('savedEmployee', savedEmployee);

      return res
        .code(200)
        .send(
          responseObj(
            'SUCCESS',
            `Employee created successfully with data: ${req.body}`
          )
        );
    } catch (err) {
      console.error(`Errored while creating an employee with message: ${err}`);
      res.code(400).send(responseObj('ERROR', `${err}`));
    }
  }

  async function getEmployee(req, res) {
    try {
    } catch (err) {}
  }

  async function updateEmployee(req, res) {
    try {
    } catch (err) {}
  }

  app.post('/updateEmployee', updateEmployee);
  app.post('/getEmployee', getEmployee);
  app.post('/createEmployee', createEmployee);

  done();
}

app.listen({ port: 1815 }, (err) => {
  if (err) throw err;
  console.log('server is listening....');
});
