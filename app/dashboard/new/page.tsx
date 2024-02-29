import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Undo2 } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import SubmitButton from "../_components/submit-button";

const NewNotePage = async () => {
  noStore();
  const { userId } = auth();
  //server-action to create note
  const postData = async (formData: FormData) => {
    "use server";

    if (!userId) {
      throw new Error("Not authorized!");
    }

    const title = formData.get("title") as string;

    await db.note.create({
      data: {
        userId: userId as string,
        title,
        //description,
        description: "",
      },
    });

    return redirect("/dashboard");
  };

  return (
    <Card>
      <form action={postData}>
        <CardHeader>
          <CardTitle>New Note</CardTitle>
          <CardDescription>Right here you can create your note</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <div className="gap-y-2 flex flex-col">
            <Label>Title</Label>
            <Input
              required
              type="text"
              name="title"
              placeholder="Title for your note"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard">
              <Undo2 className="h-6 w-6 hover:scale-125 transition-all ease-in" />
            </Link>
          </Button>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
};

export default NewNotePage;
