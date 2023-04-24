export interface Field {
  label: string;
  type: string;
  readOnly: boolean;
  calculate: string | null;
  value?: string | number;
}

export interface DataModel {
  name: string;
  fields: {[key: string]: Field};
}
