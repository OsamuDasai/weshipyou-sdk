# Capacidades Enterprise

Para organizaciones escalando a alto volumen, el SDK incluye módulos opcionales.

## Multi-Tenancy

Utiliza `AsyncLocalStorage` para aislar contextos de ejecución por `tenantId`. Esto asegura que las auditorías, logs y trazas estén correctamente etiquetadas.

```typescript
import { createTenantMiddleware } from 'weshipyou-sdk';

app.use(createTenantMiddleware(tenantProvider, extractTenant));

// Dentro de tu controlador:
await sdk.shipments.create(...); // Operará bajo el contexto actual
```

## Event Sourcing & Audit Logs

Todos los cambios críticos son registrados en una tabla inmutable con firma criptográfica HMAC-SHA256.

*   **Immutabilidad**: Una vez escrita, una entrada de log no puede ser modificada ni borrada.
*   **Exportación SIEM**: Compatible con formatos CEF y LEEF para integración con Splunk, Sentinel, etc.

```typescript
const auditLogs = await sdk.audit.exportToSIEM({ format: 'cef', range: 'last_24h' });
```

## Observabilidad Nativa

Integración directa con OpenTelemetry. Exporta automáticamente:
1.  Spans de HTTP hacia `/authentication`.
2.  Latencia de Circuit Breaker (Open vs Closed).
3.  Métricas de Rate Limiting.
