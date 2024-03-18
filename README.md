# Todo App

## Introduction
Demo Todo App with Next.js 14, Supabse, Drizzle ORM and MaterialUI

## Project Type
Frontend | Backend | Fullstack

## Deplolyed App
Github-Url: [https://deployed-site.whatever](https://github.com/Mnv17/Todo-App)

## Directory Structure
todo-app/
├─ src/
    ├─ db
       ├─ index.ts
       ├─ schema.ts
    ├─ pages
       ├─ api
          ├─ auth
              ├─ [...nextauth].ts
          ├─ trpc
              ├─ [trpc].ts
       ├─ app.tsx
       ├─ index.tsx
    ├─ servers
       ├─ api
            ├─ routers
                  ├─ todo.ts
            ├─ root.ts
            ├─ trpc.ts
    ├─ styles
       ├─ global.css
    ├─ utils
       ├─ api.ts
    ├─ env.js
## Video Walkthrough of the project
[Video(Project)](https://drive.google.com/file/d/1-Kl-5CzWCvuk4AicP83W8SFd6bwMMmHW/view?usp=sharing)

## Video Walkthrough of the codebase
[Video(Codebase)](https://drive.google.com/file/d/1tmfaPcPCHb0trl0vOa75egw1tWBz2SuQ/view?usp=sharing)

## Features
Features of this application.

- Manage tasks: Create, update, and delete todos with ease.
- Server actions: Utilize server-side logic for handling todo operations.
- Drizzle ORM integration: Seamlessly interact with the database using Drizzle ORM.
- MaterialUI: The app looks good because of MaterialUI.


## Installation & Getting started
1. Clone this repository:

   ```bash
   git clone https://github.com/mnv17/Todo-App.git
   ```

2. Navigate to the project directory:

   ```bash
   cd todo-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Make .env folder
    DATABASE_URL="postgres://postgres.aowjkpaephoqxhluktay:Krishvi@0119@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

    NEXTAUTH_URL="http://localhost:3000"

  add these things so your server will run 




## API Endpoints

GET (http://localhost:3000/) - retrieve all items
POST (http://localhost:3000/todos) - create a new item


## Technology Stack
List and provide a brief overview of the technologies used in the project.

- T3 stack
- TypeScript
- React.js
- Next.js
- NextAuth
- Drizzle ORM
- Supabase
