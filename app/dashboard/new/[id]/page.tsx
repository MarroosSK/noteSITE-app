import { db } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { SkeletonEditor } from "@/components/skeleton-editor";
import TipTapEditor from "@/components/titap-editor";
import { currentUser } from "@clerk/nextjs";
import { Undo2 } from "lucide-react";

const getData = async ({
  userId,
  noteId,
}: {
  userId: string;
  noteId: string;
}) => {
  noStore();
  const data = await db.note.findUnique({
    where: {
      id: noteId,
      userId: userId,
    },
    select: {
      title: true,
      description: true,
      id: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return data;
};

const NoteById = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  const noteData = await getData({
    userId: user?.id as string,
    noteId: params.id,
  });

  return (
    <div className="min-h-screen grainy p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border shadow-xl border-stone-200 rounded-lg p-4 flex items-center">
          <Link href="/dashboard">
            <Undo2 className="hover:scale-125 transition-all ease-in" />
          </Link>
          <div className="w-3"></div>
          <span className="font-semibold">{noteData?.user?.name}</span>
          <span className="inline-block mx-1">/</span>
          <span className="text-stone-500 font-semibold">
            {noteData?.title}
          </span>
        </div>
        {!noteData ? (
          <SkeletonEditor />
        ) : (
          <div className="border-stone-200 shadow-xl border rounded-lg px-16 py-8 w-full">
            <div className="gap-y-2 flex flex-col">
              <TipTapEditor note={noteData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteById;
