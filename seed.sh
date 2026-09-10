#!/bin/bash

echo "=================================="
echo " RA's Raids - Database Seeder"
echo "=================================="

cd Backend || exit 1

# Activate virtual environment
source venv/bin/activate

echo ""
echo "Applying migrations..."
python manage.py migrate

echo ""
echo "Seeding master data..."
python manage.py general_data_seed

if [ $? -ne 0 ]; then
    echo "ERROR: Master data seeding failed."
    exit 1
fi

# echo ""
# echo "Importing geographic data..."
# python manage.py import_geo_data geo_data.csv --country "India"

# if [ $? -ne 0 ]; then
#     echo "ERROR: Geographic data import failed."
#     exit 1
# fi

echo ""
echo "=================================="
echo " Database seeding completed!"
echo "=================================="
