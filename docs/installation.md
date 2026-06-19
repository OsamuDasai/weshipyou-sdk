# Instalación

Requiere Node.js >= 18.0.0.

## Instalar vía NPM

```bash
npm install @yourorg/weshipyou-sdk
```

## Configurar Variables de Entorno

El SDK requiere credenciales de WeShipYou para operar. Crea un archivo `.env`:

| Variable | Requerido | Descripción |
|----------|-----------|-------------|
| `WSY_BASE_URL` | ✅ | `https://weshipyou.com/api/v1` |
| `WSY_USERNAME` | ✅ | Usuario del dashboard WeShipYou |
| `WSY_PASSWORD` | ✅ | Contraseña del usuario |
| `WSY_WEBHOOK_SECRET` | ❌ | Clave secreta para verificar webhooks HMAC-SHA256 |
| `OTEL_ENDPOINT` | ❌ | Endpoint de Jaeger/Prometheus para traces |
| `DATABASE_URL` | ❌ | PostgreSQL URI para Read Models (Enterprise) |

## Configuración Básica

```typescript
import { bootstrap } from '@yourorg/weshipyou-sdk';

// Inicializar el SDK
const sdk = bootstrap(
  process.env.WSY_BASE_URL!, 
  process.env.WSY_WEBHOOK_SECRET || 'default-secret'
);

console.log('SDK Ready:', sdk.auth.isAuthenticated());
```

## Configuración de Webhooks Locales (Dev)

Para probar callbacks sin exponer tu servidor local:
1. Usa [ngrok](https://ngrok.com/) o similar.
2. En el Dashboard de WeShipYou, configura la callback URL: `https://your-ngrok-id.ngrok.io/webhooks`.
