export interface IResponseObject {
  status: string;
  message: string;
  data?: any;
  warnings?: any[];
}

export function responseObj(
  status: string,
  message: string,
  data?: any,
  warnings?: any[]
): IResponseObject {
  return {
    status,
    message,
    data,
    warnings,
  };
}

export function _removeNullAndUndefinedValuesFromObject(myObj: object) {
  if (!myObj) return null;
  Object.keys(myObj).forEach((key) => {
    if (myObj[key] === null || myObj[key] === undefined) delete myObj[key];
  });
  return myObj;
}

export function pascalCaseToSnakeCase(str: string) {
  const convertedString = str
    .split(/\.?(?=[A-Z])/)
    .join('_')
    .toLowerCase();
  return convertedString;
}
