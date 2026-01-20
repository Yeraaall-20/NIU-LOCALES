#!/bin/bash

# Script para preparar la base de datos en Railway
echo "📊 Generando cliente Prisma..."
npm run db:generate --prefix backend

echo "📊 Ejecutando migraciones..."
npm run db:push --prefix backend

echo "📊 Seteando datos iniciales..."
npm run db:seed --prefix backend

echo "✅ Base de datos lista!"
