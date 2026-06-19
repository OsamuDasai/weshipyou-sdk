# Referencia de Endpoints

Este SDK mapea todas las operaciones críticas de la API REST de WeShipYou. Consulta la [Documentación Oficial](https://weshipyou.com/docs/api) para validaciones detalladas de payloads.

## 📦 Shipments (Envíos)

| Endpoint | Método | Función SDK | Descripción |
|----------|--------|-------------|-------------|
| `/shipments/rates` | POST | `sdk.shipments.getRates()` | Calcular tarifas de envío |
| `/shipments` | POST | `sdk.shipments.create()` | Crear nuevo envío |
| `/shipments/{id}` | GET | `sdk.shipments.getById()` | Obtener info de envío |
| `/shipments/categories` | GET | `sdk.shipments.categories()` | Categorías aduaneras |
| `/shipments` | DELETE | `sdk.shipments.cancel()` | Cancelar envío (si no es manejado por carrier) |

> 💡 **Nota:** El SDK soporta `Accept-Language` dinámico (es-US, en-US, pt-BR). Por defecto usa el configurado en `.env`.

## 🔄 Forwarder (Reenvío)

| Endpoint | Método | Función SDK |
|----------|--------|-------------|
| `/forwarder` | GET | `sdk.forwarder.list()` |
| `/forwarder/{id}` | GET | `sdk.forwarder.getById()` |

## 📱 Mobile Recharges

| Endpoint | Método | Función SDK |
|----------|--------|-------------|
| `/mobile-recharges/providers` | GET | `sdk.recharges.providers()` |
| `/mobile-recharges/products-descriptions` | GET | `sdk.recharges.productsDesc()` |
| `/mobile-recharges/recharges` | POST | `sdk.recharges.execute()` |

> 💡 **Payload:** La interfaz `CreateRechargeInput` valida campos como `accountUid`, `rechargeable_product` y `scheduleDate`.

## 👤 Account & Sub-Accounts

| Endpoint | Método | Función SDK |
|----------|--------|-------------|
| `/add-sub-account` | POST | `sdk.accounts.addSubAccount()` |
| `/add-funds` | POST | `sdk.accounts.addFunds()` |

## 🎫 Pagos (Zelle/Cards)

*   Actualmente el SDK soporta flujo de fondos vía Zelle. Para otros métodos (Stripe/Bank Transfer), utiliza la función `sdk.accounts.customPayment(payload)` (Enterprise feature).
