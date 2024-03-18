// todo.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@/db";
import { todos } from "@/db/schema";

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
    .input(z.object({ id: z.string(), completed: z.boolean() })) // Change id type to string
    .mutation(async ({ input }) => {
      const updatedTodo = await db.update(todos).set({ completed: input.completed }).where({ id: parseInt(input.id, 10) }).returning(); // Parse id as a number

      console.log(updatedTodo);
      return updatedTodo;
    }),

  deleteTodo: publicProcedure
    .input(z.object({ id: z.number() })) // Keep id type as number
    .mutation(async ({ input }) => {
      const deletedTodo = await db.delete(todos).where({ id: input.id }).returning();

      console.log(deletedTodo);
      return deletedTodo;
    }),
});
