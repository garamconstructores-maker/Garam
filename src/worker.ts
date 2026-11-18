// Worker de Cloudflare: las rutas /api/* las atiende la aplicación Express;
// el resto lo sirven los assets estáticos (ver runWorkerFirst en cloudflare.config.ts).
import { httpServerHandler } from 'cloudflare:node';
import { app } from './server/app.ts';

app.listen(3000);

export default httpServerHandler({ port: 3000 });
