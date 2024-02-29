"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const postData = async (postData: string, noteId: string) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authorized!");
  }

  await db.note.update({
    where: {
      id: noteId,
      userId: userId,
    },
    data: {
      // title,
      description: postData,
    },
  });
  revalidatePath("/dashboard");
  return redirect("/dashboard");
};
