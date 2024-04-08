import { text, pgTable, serial, boolean } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
    id: serial('id').primaryKey(),
    text: text('text'),
    completed: boolean('completed'),
    // userId: text('userId'), 
});
