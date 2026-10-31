# Notes API

REST API для керування нотатками на **Node.js**, **Express 5** та **MongoDB**. Містить автентифікацію з сесіями, скидання пароля через email та завантаження аватарів у Cloudinary.

**Деплой:** https://nodejs-hw-5-rx5f.onrender.com

> Сервер працює на безкоштовному плані Render: перший запит після простою може тривати до хвилини.
>
> Повна версія проєкту знаходиться в гілці [`05-mail-and-img`](https://github.com/Andrii-Mitko/nodejs-hw/tree/05-mail-and-img).

## Зміст

- [Можливості](#можливості)
- [Технології](#технології)
- [Швидкий старт](#швидкий-старт)
- [Змінні оточення](#змінні-оточення)
- [Скрипти](#скрипти)
- [Структура проєкту](#структура-проєкту)
- [API](#api)
- [Автентифікація](#автентифікація)
- [Ліцензія](#ліцензія)

## Можливості

- Реєстрація, вхід, вихід та оновлення сесії
- Скидання пароля через email (HTML-шаблон на Handlebars)
- CRUD нотаток із пагінацією, фільтром за тегом та пошуком
- Доступ лише до власних нотаток
- Завантаження аватара користувача в Cloudinary
- Валідація запитів (celebrate/Joi)
- Централізована обробка помилок та логування запитів

## Технології

| Категорія      | Інструменти                       |
| -------------- | --------------------------------- |
| Сервер         | Node.js (ES Modules), Express 5   |
| База даних     | MongoDB, Mongoose                 |
| Автентифікація | JWT, сесії, cookie-parser, bcrypt |
| Валідація      | celebrate (Joi)                   |
| Файли          | multer, Cloudinary                |
| Email          | nodemailer, Handlebars            |
| Безпека        | helmet, cors                      |
| Логування      | pino-http, pino-pretty            |
| Якість коду    | ESLint, Prettier, EditorConfig    |

## Швидкий старт

### Вимоги

- Node.js 20+
- Обліковий запис MongoDB (локально або Atlas)
- Обліковий запис Cloudinary
- SMTP-сервіс для відправки листів

### Встановлення

```bash
git clone https://github.com/Andrii-Mitko/nodejs-hw.git
cd nodejs-hw
git checkout 05-mail-and-img
npm install
```

### Запуск

```bash
npm run dev    # розробка з автоперезавантаженням
npm start      # звичайний запуск
```

Сервер буде доступний на `http://localhost:3000` (або на порту з `PORT`).

## Змінні оточення

Створіть файл `.env` у корені проєкту:

```env
PORT=3000
NODE_ENV=development

MONGO_URL=

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

| Змінна                                                                 | Опис                                           |
| ---------------------------------------------------------------------- | ---------------------------------------------- |
| `PORT`                                                                 | Порт сервера                                   |
| `NODE_ENV`                                                             | Режим роботи (`development` / `production`)    |
| `MONGODB_URL`                                                          | Повний рядок підключення до MongoDB            |
| `JWT_SECRET`                                                           | Секрет для підпису JWT                         |
| `SMTP_HOST`, `SMTP_PORT`                                               | Адреса та порт SMTP-сервера                    |
| `SMTP_USER`, `SMTP_PASSWORD`                                           | Дані для входу в SMTP                          |
| `SMTP_FROM`                                                            | Адреса відправника листів                      |
| `FRONTEND_DOMAIN`                                                      | Адреса фронтенду для посилання скидання пароля |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Дані Cloudinary                                |

> Файл `.env` додано до `.gitignore`, не публікуйте секрети в репозиторії.

## Скрипти

| Команда       | Опис                 |
| ------------- | -------------------- |
| `npm run dev` | Запуск через nodemon |
| `npm start`   | Запуск через node    |

## Структура проєкту

```
src
├── constants       # теги нотаток, часові константи
├── controllers     # authController, notesController, userController
├── db              # підключення до MongoDB
├── middleware      # authenticate, errorHandler, logger, multer, notFoundHandler
├── models          # note, session, user
├── routes          # authRoutes, notesRoutes, userRoutes
├── services        # бізнес-логіка автентифікації
├── templates       # reset-password-email.html
├── utils           # saveFileToCloudinary, sendMail
├── validations     # authValidation, notesValidation
└── server.js       # точка входу
```

## API

### Службові

| Метод | Шлях      | Опис                                                     |
| ----- | --------- | -------------------------------------------------------- |
| GET   | `/`       | Перевірка роботи сервера (`{"message":"Hello, World!"}`) |
| GET   | `/health` | Health check                                             |

### Автентифікація

| Метод | Шлях                        | Опис                            |
| ----- | --------------------------- | ------------------------------- |
| POST  | `/auth/register`            | Реєстрація                      |
| POST  | `/auth/login`               | Вхід                            |
| POST  | `/auth/logout`              | Вихід                           |
| POST  | `/auth/refresh`             | Оновлення сесії                 |
| POST  | `/auth/request-reset-email` | Запит листа для скидання пароля |
| POST  | `/auth/reset-password`      | Встановлення нового пароля      |

Схеми тіл запитів: `src/validations/authValidation.js`.

### Нотатки

Усі маршрути потребують автентифікації.

| Метод  | Шлях             | Опис              |
| ------ | ---------------- | ----------------- |
| GET    | `/notes`         | Список нотаток    |
| GET    | `/notes/:noteId` | Нотатка за id     |
| POST   | `/notes`         | Створення нотатки |
| PATCH  | `/notes/:noteId` | Оновлення нотатки |
| DELETE | `/notes/:noteId` | Видалення нотатки |

**Query-параметри `GET /notes`:**

| Параметр  | Тип    | Опис                                        |
| --------- | ------ | ------------------------------------------- |
| `page`    | number | Номер сторінки, мінімум 1 (за замовч. 1)    |
| `perPage` | number | Елементів на сторінці, 5–20 (за замовч. 10) |
| `tag`     | string | Фільтр за тегом (`src/constants/tags.js`)   |
| `search`  | string | Пошук за текстом                            |

**Тіло `POST /notes`:**

```json
{
  "title": "Назва нотатки",
  "content": "Текст нотатки",
  "tag": "Todo"
}
```

- `title` — обов'язкове, мінімум 1 символ
- `content` — необов'язкове, може бути порожнім
- `tag` — необов'язкове, одне зі значень `TAGS`

`PATCH /notes/:noteId` приймає ті самі поля, але потрібне щонайменше одне. Параметр `noteId` має бути валідним ObjectId (24 hex-символи).

### Користувач

| Метод | Шлях               | Опис                                                     |
| ----- | ------------------ | -------------------------------------------------------- |
| PATCH | `/users/me/avatar` | Оновлення аватара (`multipart/form-data`, поле `avatar`) |

Потребує автентифікації. Приймаються лише зображення (`image/*`).

## Автентифікація

1. Після `POST /auth/login` або `POST /auth/register` сервер створює сесію та встановлює cookies.
2. Захищені маршрути перевіряються middleware `authenticate`.
3. Коли термін дії токена доступу минає, оновіть сесію через `POST /auth/refresh`.
4. Для скидання пароля викличте `POST /auth/request-reset-email`: користувач отримає лист із посиланням, а новий пароль встановлюється через `POST /auth/reset-password`.

При запитах з браузера передавайте cookies (`credentials: 'include'`).

## Ліцензія

ISC
