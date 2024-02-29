import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { Edit, File, Plus, X } from "lucide-react";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import Link from "next/link";

const getNotes = async (userId: string) => {
  /*
  const data = await db.note.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  */
  noStore();
  const data = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      notes: true,
      Subscription: {
        select: {
          status: true,
        },
      },
    },
  });
  return data;
};

const DashboardPage = async () => {
  const user = await currentUser();
  const notesData = await getNotes(user?.id as string);

  //server-action - deleteNote
  //i need hidden inptu from which i'll take id
  const deleteNote = async (formData: FormData) => {
    "use server";
    const noteId = formData.get("noteId") as string;

    await db.note.delete({
      where: {
        id: noteId,
      },
    });
    revalidatePath("/dashboard");
  };
  return (
    <div className="grid items-start gap-8">
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl ">Notes dashboard</h1>
          <p className="text-lg text-muted-foreground">your notes list</p>
        </div>
        {/* If is subscribed, allow creating notes, otherwise redirect to billing */}
        {notesData?.Subscription?.status === "active" ? (
          <Button>
            <Link href="/dashboard/new" className="flex items-center gap-x-2">
              <Plus /> Note
            </Link>
          </Button>
        ) : (
          <Button>
            <Link
              href="/dashboard/billing"
              className="flex items-center gap-x-2"
            >
              <Plus />
              Note
            </Link>
          </Button>
        )}
      </div>

      {!notesData?.notes.length ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <File className="w-10 h-10 text-primary" />
          </div>

          <h2 className="mt-6" text-xl font-semibold>
            0 notes created
          </h2>
          <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
            You currently dont have any notes, please create some.
          </p>

          {notesData?.Subscription?.status === "active" ? (
            <Button asChild>
              <Link href="/dashboard/new">Create new note</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard/billing">Create new note</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 lg:grid-cols-5  gap-3">
          {notesData?.notes.map((item) => (
            <div
              key={item.id}
              className="relative border border-stone-300 rounded-lg overflow-hidden flex flex-col hover:shadow-xl dark:shadow-md dark:hover:shadow-gray-600 transition hover:-translate-y-1"
            >
              <div className="p-4">
                <h3 className="text-xl font-semibold text-primary">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <div className=" mt-2 flex gap-x-4">
                  <Link href={`/dashboard/new/${item.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex gap-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </Link>
                  <form action={deleteNote} className="absolute top-0 right-0">
                    <input type="hidden" name="noteId" value={item.id} />
                    <Button variant="ghost" size="icon" type="submit">
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
