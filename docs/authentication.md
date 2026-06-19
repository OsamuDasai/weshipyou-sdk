# Autenticación

El SDK maneja el ciclo de vida de los tokens automáticamente. No necesitas gestionar manualmente los Bearer Tokens.

## Flujos Soportados

1.  **JWT Authentication (Recommended)**: Usado por defecto tras llamar a `bootstrap()`. Los tokens se renuevan automáticamente antes de expirar.
2.  **Secret API Key**: Para peticiones simples Server-to-Server. El SDK inyecta `x-api-key` automáticamente si se configura.

## Manejo de Errores de Auth

*   **401 Unauthorized**: Intento de acceso fallido (credenciales inválidas).
*   **Token Refresh Fail**: Si el token falla al refrescarse, el SDK disparará un evento `auth.session_expired`.

## Verificación de Webhooks

Al recibir un webhook de WeShipYou, verifica siempre la firma HMAC:

```typescript
const isValid = await sdk.webhookHandler.verifySignature(
  rawBody, 
  req.headers['x-websignature'] as string
);
```
Ver [Referencia de la API Oficial](https://weshipyou.com/docs/api) para detalles sobre generación de tokens.
