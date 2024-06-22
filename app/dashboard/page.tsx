import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Note from "@/models/noteModel";
import User from "@/models/userModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Edit, File, NotebookPen, Trash } from "lucide-react";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { DeleteNoteButton } from "../components/SubmitButton";

async function getData(email: string) {
  noStore();
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("No user found...");
  }

  const data = await Note.find({
    userId: user._id,
  }).sort({ createdAt: -1 });

  return JSON.stringify(data);
}

export default async function Dashboard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.email as string);
  const noteData = JSON.parse(data);

  async function deleteNote(formData: FormData) {
    "use server";

    const noteId = formData.get("noteId") as string;
    const note = await Note.findById(noteId);

    if (!note) {
      throw new Error("Note not found");
    }

    await Note.deleteOne({ _id: noteId });

    revalidatePath("/dashboard");
  }
  return (
    <div className="grid items-start gap-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl font-bold">Your Notes</h1>
          <p className="text-lg text-muted-foreground">
            Here you can see and create notes
          </p>
        </div>

        <Button asChild>
          <Link href={"/dashboard/new"}>
            <NotebookPen className="mr-2 w-4 h-4" />
            Create new note
          </Link>
        </Button>
      </div>

      {noteData.length == 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <File className="w-10 h-10 text-primary" />
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            You dont have any notes created
          </h2>

          <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
            You currently dont have any notes, please create some so that you
            can see them right here.
          </p>

          <Button asChild>
            <Link href={"/dashboard/new"}>
              <NotebookPen className="mr-2 w-4 h-4" /> Create new note
            </Link>
          </Button>
        </div>
      ) : (
        <div>
          {noteData.map((item: any, index: any) => (
            <Card key={index} className="flex items-center justify-between p-4">
              <div>
                <h2 className="font-semibold text-xl text-primary">
                  {item.title}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "full",
                  }).format(new Date(item.createdAt))}
                </p>
              </div>

              <div className="flex gap-x-4">
                <Link href={`/dashboard/new/${item._id}`}>
                  <Button variant={"outline"} size={"icon"}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <form action={deleteNote}>
                  <input type="hidden" name="noteId" value={item._id} />
                  <DeleteNoteButton />
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
