export type LooseDictionary = { [index in string]: any };
import { Configuration as BaseWebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

// webpack "devServer" declaration merging broke unexpectedly, this helper is a workaround
// See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/27570#issuecomment-555529569
export interface WebpackConfiguration extends BaseWebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

export type StringDictionary<T extends string> = Required<
  { [index in T]: string }
>;

// See: https://stackoverflow.com/a/49936686/7931540
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};
