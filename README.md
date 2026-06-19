# WeShipYou SDK

SDK oficial en TypeScript para la API de WeShipYou. Gestión de envíos, tarifas, recargas móviles, webhooks, multi-tenancy, CQRS, auditoría y más.

## Instalación

```bash
npm install weshipyou-sdk
```

## Uso rápido

```typescript
import { bootstrap } from 'weshipyou-sdk'

const { authService, ratesService, shipmentService } = bootstrap({
  baseURL: 'https://weshipyou.com/api/v1',
  email: 'tu@email.com',
  password: 'tu-password',
  accountId: 'tu-account-id',
})

// Obtener tarifas
const rates = await ratesService.getRates({
  accountId: 'CU4MTDLV',
  totalValue: 100,
  incoterms: 'DAP',
  sender: { /* ... */ },
  recipient: { /* ... */ },
  parcels: [ /* ... */ ],
})
```

Ver [documentación completa](./docs/).

## Licencia

**WeShipYou SDK** — Copyright (c) 2024 Dazai Osamu

Este proyecto está licenciado bajo los términos de la **MIT License** con una cláusula adicional de atribución.

**Tú debes incluir en tu aplicación** (en una sección de créditos, "Acerca de", ajustes o legal) el siguiente texto:

```
Powered by WeShipYou SDK — https://github.com/OsamuDasai/weshipyou-sdk
Contact: dazaiosamu.2b2t@gmail.com
```

Ver el archivo [LICENSE](./LICENSE) para los términos completos.
