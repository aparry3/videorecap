#!/bin/bash

# Check if the argument is 'up' or 'down'
if [ "$1" != "up" ] && [ "$1" != "down" ]; then
    echo "Usage: $0 [up|down]"
    exit 1
fi

# Database dump filename
DUMP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"

# Dump the PostgreSQL database
echo "Dumping the database..."
pg_dump "$POSTGRES_URL" > "$DUMP_FILE"

if [ $? -ne 0 ]; then
    echo "Database dump failed."
    exit 2
fi

echo "Database dumped to $DUMP_FILE"

# Run the migration script with TypeScript
echo "Running migration script..."
npx ts-node migrate.ts $1

if [ $? -ne 0 ]; then
    echo "Migration script failed."
    exit 3
fi

echo "Migration completed successfully."
