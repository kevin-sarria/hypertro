// Backend Main Entrypoint

import { createContainer } from './infrastructure/container';
import { createApp } from './infrastructure/http/app';
import { env } from './infrastructure/config/env';

async function bootstrap() {
  const container = createContainer();
  const app = createApp(container);

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.info(`[Hypertro] Backend en ejecucion en el puerto ${env.PORT} (${env.NODE_ENV})`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[Hypertro] Fallo al iniciar el servidor:', err);
  process.exit(1);
});
