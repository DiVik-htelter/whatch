"""
Модуль для работы с данными часов
"""
import json
import os

# Путь к файлу JSON для хранения данных о часах
WATCHES_DATA_FILE = 'watches.json'

# Инициализация хранилища данных, если файл не существует
def init_watches_data():
    if not os.path.exists(WATCHES_DATA_FILE):
        with open(WATCHES_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False)
        print("Создан новый файл данных для часов")
    
# Получение списка всех часов
def get_all_watches():
    try:
        with open(WATCHES_DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        init_watches_data()
        return []
    except json.JSONDecodeError:
        print("Ошибка декодирования JSON. Создание нового файла данных.")
        init_watches_data()
        return []

# Добавление новых часов
def add_watch(watch_data):
    watches = get_all_watches()
    
    # Генерация нового id
    new_id = 1
    if watches:
        new_id = max(watch['id'] for watch in watches) + 1
    
    # Добавление id к данным часов
    watch_data['id'] = new_id
    watches.append(watch_data)
    
    # Сохранение данных
    with open(WATCHES_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(watches, f, ensure_ascii=False, indent=2)
    
    return watch_data

# Обновление данных часов по id
def update_watch(watch_id, watch_data):
    watches = get_all_watches()
    watch_id = int(watch_id)  # Преобразование id в число
    
    for i, watch in enumerate(watches):
        if watch['id'] == watch_id:
            watch_data['id'] = watch_id  # Сохраняем оригинальный id
            watches[i] = watch_data
            
            # Сохранение обновленных данных
            with open(WATCHES_DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(watches, f, ensure_ascii=False, indent=2)
            
            return watch_data
    
    return None  # Если часы с таким id не найдены

# Удаление часов по id
def delete_watch(watch_id):
    watches = get_all_watches()
    watch_id = int(watch_id)  # Преобразование id в число
    
    for i, watch in enumerate(watches):
        if watch['id'] == watch_id:
            deleted_watch = watches.pop(i)
            
            # Сохранение обновленных данных
            with open(WATCHES_DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(watches, f, ensure_ascii=False, indent=2)
            
            return deleted_watch
    
    return None  # Если часы с таким id не найдены

# Получение часов по id
def get_watch_by_id(watch_id):
    watches = get_all_watches()
    watch_id = int(watch_id)
    
    for watch in watches:
        if watch['id'] == watch_id:
            return watch
    
    return None  # Если часы с таким id не найдены

# Инициализация при импорте
init_watches_data()
