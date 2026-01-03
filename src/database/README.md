# Database Seeders

Sistema de seeders para poblar la base de datos con datos de prueba (similar a Laravel seeders).

## Uso

### Opción 1: Compilar y ejecutar (Recomendado)

```bash
npm run build
node -r tsconfig-paths/register dist/database/seed.js
```

### Opción 2: Usar ts-node (puede tener problemas con dependencias)

```bash
npm run seed:dev
```

## Seeders Disponibles

1. **UserSeeder**: Crea 20 usuarios
2. **ContactSeeder**: Crea 50 contactos (requiere usuarios)
3. **CompanySeeder**: Crea 30 empresas (requiere usuarios y contactos)
4. **BankSeeder**: Crea 15 bancos
5. **ApplicationSeeder**: Crea 20 aplicaciones (requiere empresas y usuarios)
6. **LeadSeeder**: Crea 5 grupos de leads (requiere usuarios)

## Orden de Ejecución

Los seeders se ejecutan en el siguiente orden:
1. Users
2. Contacts
3. Companies
4. Banks
5. Applications
6. Leads

## Notas

- Los seeders usan `@faker-js/faker` para generar datos aleatorios
- Todos los datos generados respetan las validaciones del dominio
- Si falta una entidad requerida, el seeder mostrará un warning y continuará
- Los errores de duplicados se ignoran automáticamente

## Limpiar Datos

Para limpiar los datos generados, puedes usar los métodos `clean()` de cada seeder (aún no implementado en el script principal).

