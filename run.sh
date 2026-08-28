#!/bin/bash
# Start Django backend
echo "Starting Django backend..."
cd backend
source venv/bin/activate
python manage.py runserver &
BACKEND_PID=$!

# Start Angular frontend
echo "Starting Angular frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "=================================="
echo " MySavaari Development Servers"
echo "=================================="
echo " Django  : http://127.0.0.1:8000"
echo " Angular : http://localhost:4200"
echo "=================================="
echo "Press Ctrl+C to stop both servers"

# Stop both when Ctrl+C is pressed
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" SIGINT SIGTERM
wait