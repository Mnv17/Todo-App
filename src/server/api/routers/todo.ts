//todo.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { sql } from 'drizzle-orm';

export const todoRouter = createTRPCRouter({
  submitTodo: publicProcedure
    .input(z.object({ text: z.string().min(5), completed: z.boolean().optional() }))
    .mutation(async ({ input }) => {
      const newTodo = await db.insert(todos).values({
        text: input.text,
        completed: input.completed ?? false, 
      }).returning();

      console.log(newTodo);
      return newTodo;
    }),

  getTodos: publicProcedure.query(async () => {
    return await db.select().from(todos);
  }),

  updateTodo: publicProcedure
  .input(z.object({ id: z.string(), text: z.string().min(5), completed: z.boolean() }))
  .mutation(async ({ input }) => {
    const idNumber: number = parseInt(input.id, 10); 

    const updatedTodo = await db.update(todos)
      .set({ text: input.text, completed: input.completed })
      .where(sql`id = ${idNumber}`)
      .returning();

    console.log(updatedTodo);
    return updatedTodo;
  }),


  deleteTodo: publicProcedure
    .input(z.object({ id: z.string() })) 
    .mutation(async ({ input }) => {
      const idNumber: number = parseInt(input.id, 10);
      const deletedTodo = await db.delete(todos)
        .where(sql`id = ${idNumber}`) 
        .returning();

      console.log(deletedTodo);
      return deletedTodo;
    }),
})