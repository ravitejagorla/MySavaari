import os
import shutil

APPS_DIR = os.path.dirname(os.path.abspath(__file__)) 
MIGRATIONS_FOLDER_NAME = "migrations"
INIT_FILE_NAME = "__init__.py"
EXCLUDE_DIRS = [
    '__pycache__', 
    MIGRATIONS_FOLDER_NAME 
]

print(f"Starting migration cleanup in: {APPS_DIR}\n")

for item in os.listdir(APPS_DIR):
    app_path = os.path.join(APPS_DIR, item)

    if os.path.isdir(app_path) and item not in EXCLUDE_DIRS:
        
        migrations_path = os.path.join(app_path, MIGRATIONS_FOLDER_NAME)
        
        print(f"Processing app: {item}")
        
        if os.path.exists(migrations_path):
            try:
                shutil.rmtree(migrations_path)
                print(f"  ✅ Deleted existing '{MIGRATIONS_FOLDER_NAME}' folder.")
            except OSError as e:
                print(f"  ❌ Error deleting folder: {e}")
                continue
        else:
            print(f"  ℹ️ '{MIGRATIONS_FOLDER_NAME}' folder not found. Skipping deletion.")

        try:
            os.makedirs(migrations_path, exist_ok=True)
            print(f"  ✅ Created new '{MIGRATIONS_FOLDER_NAME}' folder.")
        except OSError as e:
            print(f"  ❌ Error creating folder: {e}")
            continue

        init_file_path = os.path.join(migrations_path, INIT_FILE_NAME)
        try:
            with open(init_file_path, 'w') as f:
                f.write("")
            print(f"  ✅ Created '{INIT_FILE_NAME}' inside.")
        except IOError as e:
            print(f"  ❌ Error creating {INIT_FILE_NAME}: {e}")
            
    elif os.path.isdir(app_path) and item in EXCLUDE_DIRS:
         print(f"Skipping excluded directory: {item}")
        
print("\nMigration cleanup complete. Remember to run 'python manage.py makemigrations' next.")