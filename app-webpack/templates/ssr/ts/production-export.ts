/**
 * Start the SSR server or export your handler for serverless use
 * or export whatever else fits your needs.
 *
 * https://v2.quasar.dev/quasar-cli/developing-ssr/ssr-production-export
 *
 * This file is used ONLY on production.
 */

import { ssrProductionExport } from 'quasar/wrappers';

export default ssrProductionExport(async ({ app, port, isReady }) => {
  await isReady();
  return app.listen(port, () => {
    console.log('Server listening at port ' + port);
  });
});
