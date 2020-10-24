import { Configuration as BaseWebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

// webpack "devServer" declaration merging broke unexpectedly, this helper is a workaround
// See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/27570#issuecomment-555529569
export interface WebpackConfiguration extends BaseWebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}
