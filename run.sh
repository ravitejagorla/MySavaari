#!/bin/bash
# Start Django Backend
echo "Starting Django Backend..."
cd Backend
source venv/bin/activate
python manage.py runserver &
BACKEND_PID=$!

# Start Angular Frontend
echo "Starting Angular Frontend..."
cd ../Frontend
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