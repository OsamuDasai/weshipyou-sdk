# WeShipYou CLI

Herramienta de línea de comandos para acelerar el desarrollo y mantener integridad de datos.

## Instalación Global (Opcional)

```bash
npm install -g @yourorg/weshipyou-cli
```

## Comandos Disponibles

### `init`
Crea una estructura de proyecto lista para producción con configuración base.

```bash
weshipyou init --name my-logistics-app
```

Genera:
*   `.env.example`
*   `package.json` con dependencias básicas.
*   Estructura de carpetas Clean Architecture.

### `replay`
Reproduce eventos históricos desde la base de datos local (SQLite/Postgres) a un consumidor definido. Útil para migraciones de datos o reconstrucción de read models.

```bash
weshipyou replay --since "2023-01-01T00:00:00Z" --output ./logs/events.json
```

### `health`
Verifica la conectividad con la API de WeShipYou y el estado interno del SDK (Circuit Breaker, DB Connection).

```bash
weshipyou health
```
