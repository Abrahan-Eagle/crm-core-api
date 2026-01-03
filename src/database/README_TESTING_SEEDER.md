# Seeder de Testing para cancelOffer Fix

## ¿Qué hace este seeder?

El `ApplicationTestingSeeder` crea **4 aplicaciones de prueba** con notificaciones y ofertas específicamente diseñadas para probar el fix de `cancelOffer`.

## Aplicaciones Creadas

### Test Case 1: Cambio a REPLIED
- **Estado inicial**: `OFFERED`
- **Notificaciones**:
  - Notificación 1: `OFFERED` con 1 oferta `ACCEPTED` (será cancelada)
  - Notificación 2: `REPLIED` sin ofertas
- **Comportamiento esperado**: Al cancelar la oferta, el estado debe cambiar a `REPLIED`

### Test Case 2: Múltiples ofertas pendientes
- **Estado inicial**: `OFFERED`
- **Notificaciones**:
  - Notificación 1: `OFFERED` con 2 ofertas `ACCEPTED` (una será cancelada)
  - Notificación 2: `OFFERED` con 1 oferta `ACCEPTED`
- **Comportamiento esperado**: Al cancelar una oferta, el estado debe permanecer `OFFERED` (hay otras ofertas pendientes)

### Test Case 3: Mantener OFFER_ACCEPTED
- **Estado inicial**: `OFFER_ACCEPTED`
- **Notificaciones**:
  - Notificación 1: `ACCEPTED` con 1 oferta `ACCEPTED` (oferta aceptada)
  - Notificación 2: `OFFERED` con 1 oferta `ACCEPTED` (será cancelada)
- **Comportamiento esperado**: Al cancelar la oferta, el estado debe permanecer `OFFER_ACCEPTED` (hay una notificación aceptada)

### Test Case 4: Cambio a SENT
- **Estado inicial**: `OFFERED`
- **Notificaciones**:
  - Notificación 1: `REJECTED` con 1 oferta `ACCEPTED` (será cancelada)
- **Comportamiento esperado**: Al cancelar la oferta, el estado debe cambiar a `SENT` (no hay notificaciones REPLIED/SENT)

## Cómo Usar

### 1. Ejecutar el seeder

```bash
npm run seed
```

Esto creará las 4 aplicaciones de testing en la base de datos.

### 2. Probar el fix

Para probar el fix, necesitas:

1. **Obtener las aplicaciones creadas** desde la base de datos
2. **Cancelar una oferta** usando la API o un script de testing
3. **Verificar que el estado cambia correctamente**

### Ejemplo de script de testing (pseudo-código):

```typescript
// Obtener aplicación de testing
const application = await applicationRepository.findById(testApplicationId);

// Obtener la primera notificación con oferta
const notification = application.notifications.find(n => n.offers.length > 0);
const offer = notification.offers[0];

// Cancelar la oferta
await application.cancelOffer(notification.id, offer.id);

// Verificar el estado
console.log('Estado después de cancelar:', application.status);
// Debe ser REPLIED, SENT, o mantener OFFERED/OFFER_ACCEPTED según el caso

// Guardar los cambios
await applicationRepository.updateOne(application);
```

## Notas Importantes

⚠️ **Estas aplicaciones se crean usando el constructor directamente** (bypass validation), por lo que:
- No tienen documentos (bankStatements, etc.)
- Solo son válidas para testing del fix de `cancelOffer`
- No deben usarse para otras pruebas que requieran aplicaciones completas

⚠️ **Las aplicaciones se guardan para el tenant**: `business_market_finders`

⚠️ **Para limpiar**: Ejecutar `npm run seed` nuevamente limpiará y recreará todas las aplicaciones.

## Estado Actual

✅ El seeder funciona correctamente
✅ Las aplicaciones se guardan en la base de datos
✅ Cada aplicación tiene notificaciones y ofertas configuradas para probar diferentes escenarios

Para probar el fix completamente, necesitarías:
1. Un script que cargue estas aplicaciones
2. Cancelar ofertas
3. Verificar que el estado cambia correctamente
4. O usar la API directamente

