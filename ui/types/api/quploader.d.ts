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
  url?: ValueOrFunction<string, readonly File[]>;
  method?: ValueOrFunction<LiteralUnion<"POST" | "PUT">, readonly File[]>;
  headers?: ValueOrFunction<QUploaderHeaderItem[], readonly File[]>;
  formFields?: ValueOrFunction<QUploaderFormFieldsItem[], readonly File[]>;
  fieldName?: ValueOrFunction<string, File>;
  withCredentials?: ValueOrFunction<boolean, readonly File[]>;
  sendRaw?: ValueOrFunction<boolean, readonly File[]>;
};

export type QUploaderFactoryFn = (
  files: readonly File[],
) => QUploaderFactoryObject | Promise<QUploaderFactoryObject>;
