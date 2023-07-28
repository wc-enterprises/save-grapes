import { customAlphabet } from 'nanoid';
export type EMA_ID_TYPES =
  | 'ADDRESS_ID'
  | 'ROLE_ID'
  | 'ROLE_HISTORY_ID'
  | 'TEAM_HISTORY_ID'
  | 'DOCUMENT_ID';

const EMA_ID_TYPE_OBJECT: { [key in EMA_ID_TYPES]: string } = {
  ADDRESS_ID: 'ad',
  ROLE_ID: 'ro',
  ROLE_HISTORY_ID: 'rh',
  TEAM_HISTORY_ID: 'th',
  DOCUMENT_ID: 'doc',
};

export function generateIds(idToBeGenerated: EMA_ID_TYPES) {
  const generatedId =
    EMA_ID_TYPE_OBJECT[idToBeGenerated] +
    '_' +
    customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)();
  return generatedId;
}
