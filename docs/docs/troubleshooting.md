# Troubleshooting

## Error: `401 Unauthorized`

**Causa**: Credenciales inválidas o token expirado que no pudo refrescarse.

**Solución**:
1. Verifica que `WSY_USERNAME` y `WSY_PASSWORD` estén correctos en `.env`.
2. Asegúrate de que la cuenta asociada esté activa en el dashboard de WeShipYou.
3. Si el error persiste, destruye el token manualmente: `sdk.auth.destroyToken()` y vuelve a llamar a `bootstrap()`.

## Error: `ENOTFOUND` al iniciar

**Causa**: `WSY_BASE_URL` incorrecta o falta de conectividad a Internet.

**Solución**: Verifica que `WSY_BASE_URL` apunte a `https://weshipyou.com/api/v1` (producción) o a la URL correcta de sandbox.

## Error: `Circuit Breaker OPEN`

**Causa**: La API de WeShipYou ha respondido con errores consecutivos (5xx o timeout) más de 5 veces.

**Solución**:
1. Revisa el estado del servicio en [status.weshipyou.com](https://status.weshipyou.com).
2. Espera 30 segundos (tiempo de recuperación automática del CB).
3. Si el error continúa, forza el reset: `sdk.circuitBreaker.forceClose()`.

## Error: `HMAC signature mismatch`

**Causa**: El webhook recibido tiene una firma que no coincide con `WSY_WEBHOOK_SECRET`.

**Solución**:
1. Asegúrate de que el `webhookSecret` pasado a `bootstrap()` sea exactamente el mismo configurado en el dashboard.
2. Verifica que el `rawBody` no haya sido modificado por ningún middleware (por ejemplo, `body-parser` json).

## Error: `Rate Limit Exceeded`

**Causa**: Has superado 100 requests en los últimos 15 minutos.

**Solución**:
1. Implementa backoff en tu aplicación o escala horizontalmente.
2. Contacta a soporte para solicitar un límite superior.
