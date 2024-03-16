import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@/db";
import { todos } from "@/db/schema";

export const todoRouter = createTRPCRouter({
  submitTodo: publicProcedure
    .input(z.object({ text: z.string().min(5) }))
    .mutation(async ({ input }) => {
      const newTodo = await db.insert(todos).values({
        text: input.text,
      }).returning();

      console.log(newTodo);
      return newTodo; 
    }),

  getTodos: publicProcedure.query(async () => {
    return await db.select().from(todos);
  }),
});