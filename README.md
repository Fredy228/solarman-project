## Description

Website для компанії Solarman.

## Project setup

1. Конфігурація environment variables (.env)
Список змінних середовища є в файлі .env.example

2. Встановлення сервісу Docker

3. Сбірка проекту
```bash
docker compose build
```

4. Запуск бази даних
```bash
docker compose up -d db
```

5. Заходимо в консоль бази даних
```bash
docker compose exec db bash
```

6. Налаштування бази даних
```bash
mongosh -u {DB_USER} -p {DB_PASSWORD} --authenticationDatabase admin --eval "rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'localhost:27017' }] })"
```

7. Виходимо з бази даних
```bash
exit
```

8. Запускаємо проект
```bash
docker compose up -d
```
