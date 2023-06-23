import appPaths from '../../app-paths.js'
import { getPackagePath } from '../../utils/get-package-path.js'
import { getPackageMajorVersion } from '../../utils/get-package-major-version.js'

export const capBin = getPackagePath('@capacitor/cli/bin/capacitor', appPaths.capacitorDir)

export const capVersion = getPackageMajorVersion('@capacitor/cli', appPaths.capacitorDir)
