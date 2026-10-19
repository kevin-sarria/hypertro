#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "=== Aplicando esquemas DDL (001 a 006) ==="
for schema_file in \
  database/schema/001_roles_users.sql \
  database/schema/002_squads.sql \
  database/schema/003_exercises.sql \
  database/schema/004_workouts.sql \
  database/schema/005_nutrition.sql \
  database/schema/006_views.sql
do
  echo "Ejecutando $schema_file..."
  docker compose exec -T mysql mysql -uroot -phypertro_root hypertro < "$schema_file"
done

echo "=== Aplicando procedimientos almacenados ==="
echo "Ejecutando database/procedures/sp_log_exercise_set.sql..."
docker compose exec -T mysql mysql -uroot -phypertro_root hypertro < database/procedures/sp_log_exercise_set.sql

echo "=== Aplicando semillas iniciales (seeds) ==="
echo "Ejecutando database/seeds/001_roles_seed.sql..."
docker compose exec -T mysql mysql -uroot -phypertro_root hypertro < database/seeds/001_roles_seed.sql

echo "=== Migraciones y seeds completadas con exito ==="
