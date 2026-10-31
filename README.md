# Notes API

REST API для керування нотатками з автентифікацією користувачів, завантаженням аватарів та відновленням пароля через email.

## Технології

- **Node.js** (ES Modules) + **Express 5**
- **MongoDB** + **Mongoose**
- **JWT** + сесії (cookies) + **bcrypt**
- **celebrate** — валідація запитів
- **multer** + **Cloudinary** — завантаження файлів
- **nodemailer** + **Handlebars** — листи для скидання пароля
- **pino-http** — логування
- **helmet**, **cors** — безпека

## Можливості

- Реєстрація, вхід, вихід, оновлення сесії
- Скидання пароля через email
- CRUD нотаток (доступ лише до власних)
- Оновлення аватара користувача
- Валідація, централізована обробка помилок

## Швидкий старт

```bash
git clone https://github.com/Andrii-Mitko/nodejs-hw.git
cd nodejs-hw
npm install
```

Створіть файл `.env` у корені проєкту:

```env
PORT=3000
NODE_ENV=development

MONGODB_URL=

JWT_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=

FRONTEND_DOMAIN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Запуск:

```bash
npm run dev    # розробка (nodemon)
npm start      # продакшн
```

## Скрипти

| Команда       | Опис                           |
| ------------- | ------------------------------ |
| `npm run dev` | Запуск з автоперезавантаженням |
| `npm start`   | Звичайний запуск               |

## Структура проєкту

```
src
├── constants       # константи (теги, час)
├── controllers     # обробники маршрутів
├── db              # підключення до MongoDB
├── middleware      # authenticate, errorHandler, logger, multer, notFoundHandler
├── models          # note, session, user
├── routes          # authRoutes, notesRoutes, userRoutes
├── services        # бізнес-логіка автентифікації
├── templates       # HTML-шаблон листа скидання пароля
├── utils           # saveFileToCloudinary, sendMail
├── validations     # схеми celebrate
└── server.js       # точка входу
```

## API

### Автентифікація

| Метод | Шлях                        | Опис                            |
| ----- | --------------------------- | ------------------------------- |
| POST  | `/auth/register`            | Реєстрація                      |
| POST  | `/auth/login`               | Вхід                            |
| POST  | `/auth/logout`              | Вихід                           |
| POST  | `/auth/refresh`             | Оновлення сесії                 |
| POST  | `/auth/request-reset-email` | Запит листа для скидання пароля |
| POST  | `/auth/reset-password`      | Встановлення нового пароля      |

### Нотатки (потрібна автентифікація)

| Метод  | Шлях             | Опис                                |
| ------ | ---------------- | ----------------------------------- |
| GET    | `/notes`         | Список нотаток (пагінація, фільтри) |
| GET    | `/notes/:noteId` | Нотатка за id                       |
| POST   | `/notes`         | Створення нотатки                   |
| PATCH  | `/notes/:noteId` | Оновлення нотатки                   |
| DELETE | `/notes/:noteId` | Видалення нотатки                   |

### Користувач (потрібна автентифікація)

| Метод | Шлях               | Опис                                                     |
| ----- | ------------------ | -------------------------------------------------------- |
| PATCH | `/users/me/avatar` | Оновлення аватара (`multipart/form-data`, поле `avatar`) |

## Лицензия

ISC
