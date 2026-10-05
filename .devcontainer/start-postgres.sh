#!/usr/bin/env bash
set -euo pipefail

: "${POSTGRES_DB:=mypricebook_dev}"
: "${POSTGRES_USER:=mypricebook_dev}"
: "${POSTGRES_PASSWORD:=mypricebook_dev}"

if ! pg_isready -q; then
    sudo service postgresql start
fi

for i in {1..20}; do
    if pg_isready -q; then
        break
    fi
    sleep 1
done

if ! pg_isready -q; then
    echo "PostgreSQL did not become ready."
    exit 1
fi

sudo -u postgres psql --set ON_ERROR_STOP=1 \
    --set=db_user="$POSTGRES_USER" \
    --set=db_password="$POSTGRES_PASSWORD" <<'SQL'
SELECT format(
    'CREATE ROLE %I LOGIN PASSWORD %L',
    :'db_user',
    :'db_password'
)
WHERE NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles
    WHERE rolname = :'db_user'
)
\gexec

ALTER ROLE :"db_user" WITH LOGIN PASSWORD :'db_password';
SQL

sudo -u postgres psql --set ON_ERROR_STOP=1 \
    --set=db_name="$POSTGRES_DB" \
    --set=db_user="$POSTGRES_USER" <<'SQL'
SELECT format(
    'CREATE DATABASE %I OWNER %I',
    :'db_name',
    :'db_user'
)
WHERE NOT EXISTS (
    SELECT FROM pg_catalog.pg_database
    WHERE datname = :'db_name'
)
\gexec

ALTER DATABASE :"db_name" OWNER TO :"db_user";
SQL

echo "PostgreSQL is ready: ${POSTGRES_DB}"
