export interface IEmployeeDetails {
  employeeId: string;
  firstName: string;
  middleName: string;
  surName: string;
  dob: string;
  address: IAddress;
  phoneNumber: string;
  role: IRole;
  sex: string;
  bloodGroup: string;
  documents: IDocument[];
  joiningDate: Date;
  status: 'WORKING' | 'RESIGNED';
}

export interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  country: string;
  postalCode: number;
}

export interface IRole {
  name: string;
  endDate: string;
}

export interface IDocument {
  name: string;
  description: string;
  url: string;
  type?: string;
}
