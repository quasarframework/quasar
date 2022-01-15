import { LiteralUnion } from "../ts-helpers";

export interface QUploaderHeaderItem {
  name: string;
  value: string;
}
export interface QUploaderFormFieldsItem {
  name: string;
  value: string;
}

type ValueOrFunction<ValueType, Param = never> =
  | ((arg: Param) => ValueType)
  | ValueType;

export type QUploaderFactoryObject = {
  url?: ValueOrFunction<string, File[]>;
  method?: ValueOrFunction<LiteralUnion<"POST" | "PUT">, File[]>;
  headers?: ValueOrFunction<QUploaderHeaderItem[], File[]>;
  formFields?: ValueOrFunction<QUploaderFormFieldsItem[], File[]>;
  fieldName?: ValueOrFunction<string, File>;
  withCredentials?: ValueOrFunction<boolean, File[]>;
  sendRaw?: ValueOrFunction<boolean, File[]>;
};

export type QUploaderFactoryFn = (
  files: File[]
) => QUploaderFactoryObject | Promise<QUploaderFactoryObject>;
