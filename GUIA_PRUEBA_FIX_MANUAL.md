# Guía para Probar el Fix de cancelOffer Manualmente

## Situación Actual

Solo tienes una aplicación en estado **"Ready to send"**, pero para probar el fix de `cancelOffer` necesitas aplicaciones con **ofertas ya creadas y aceptadas**.

## Solución: Usar la Aplicación Existente

Puedes avanzar manualmente la aplicación que tienes hasta tener ofertas para probar el fix.

### Pasos Detallados:

#### 1. Enviar la aplicación a bancos
   - Desde la UI de Applications, selecciona la aplicación "Reilly - Harvey Corp"
   - Haz clic en el botón para enviar a bancos
   - Esto cambiará el estado de `READY_TO_SEND` → `SENT`
   - Se crearán notificaciones para los bancos seleccionados

#### 2. Crear ofertas (simular respuesta de banco)
   
   **Opción A: Desde la API directamente**
   
   ```bash
   # Primero, necesitas el ID de la aplicación y la notificación
   # Endpoint para crear una oferta:
   PUT /v1/applications/{applicationId}/notifications/{notificationId}/update/{offerId}
   
   # O crear una nueva oferta:
   POST /v1/applications/{applicationId}/notifications/{notificationId}/offers
   ```
   
   **Opción B: Usar el webhook del banco** (si tienes acceso)
   - Los bancos normalmente crean ofertas a través de webhooks
   - Esto cambiará el estado a `OFFERED`

#### 3. Aceptar una oferta
   - Desde la UI o API: 
   ```
   PUT /v1/applications/{applicationId}/notifications/{notificationId}/accept/{offerId}
   ```
   - Esto puede cambiar el estado a `OFFER_ACCEPTED` si es la primera oferta aceptada

#### 4. **PROBAR EL FIX: Cancelar una oferta**
   
   **Endpoint:**
   ```
   PUT /v1/applications/{applicationId}/notifications/{notificationId}/cancel/{offerId}
   ```
   
   **Comportamiento Esperado:**
   
   - ✅ Si era la **última oferta pendiente** → el estado debe cambiar a `REPLIED` o `SENT`
   - ✅ Si hay **otras ofertas pendientes** → el estado debe mantenerse en `OFFERED`
   - ✅ Si hay una **notificación aceptada** → el estado debe mantenerse en `OFFER_ACCEPTED`
   
   **Verificar:**
   - Consulta el estado de la aplicación después de cancelar
   - Verifica que el estado cambió correctamente según el escenario

### Escenarios de Prueba Recomendados:

**Escenario 1: Cancelar última oferta pendiente**
1. Aplicación con estado `OFFERED`
2. Una notificación con una oferta `ACCEPTED`
3. Cancelar esa oferta
4. **Resultado esperado:** Estado cambia a `REPLIED` o `SENT`

**Escenario 2: Cancelar oferta pero hay otras pendientes**
1. Aplicación con estado `OFFERED`
2. Múltiples notificaciones con ofertas `ACCEPTED`
3. Cancelar una oferta
4. **Resultado esperado:** Estado se mantiene en `OFFERED`

**Escenario 3: Cancelar oferta cuando hay notificación aceptada**
1. Aplicación con estado `OFFER_ACCEPTED`
2. Una notificación en estado `ACCEPTED` y otra con oferta `ACCEPTED`
3. Cancelar la oferta de la segunda notificación
4. **Resultado esperado:** Estado se mantiene en `OFFER_ACCEPTED`

## Nota sobre las Aplicaciones de Testing del Seeder

Las aplicaciones creadas por el seeder pueden no aparecer en la UI porque:
- Se crearon sin documentos (bankStatements, etc.)
- La UI puede filtrar aplicaciones incompletas
- Pueden requerir permisos específicos

Si quieres usarlas, necesitarías consultarlas directamente desde la API o modificar el seeder para crear aplicaciones completas.

## Recomendación

Usa la aplicación que ya tienes ("Reilly - Harvey Corp") y sigue los pasos 1-4 arriba. Es la forma más rápida de probar el fix.

¿Necesitas ayuda con algún paso específico o con los endpoints de la API?
