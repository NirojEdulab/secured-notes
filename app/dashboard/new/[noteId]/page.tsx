import { SubmitButton } from "@/app/components/SubmitButton";
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
import { Textarea } from "@/components/ui/textarea";
import Note from "@/models/noteModel";
import User from "@/models/userModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

async function getNoteData(email: string, noteId: string) {
  noStore();
  const userData = await User.findOne({
    email,
  });

  if (!userData) {
    throw new Error("Not Authorized!!!");
  }

  const noteData = await Note.findOne({
    userId: userData._id,
    _id: noteId,
  });

  return JSON.stringify(noteData);
}

export default async function NotePage({
  params,
}: {
  params: { noteId: string };
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const olddata = await getNoteData(
    user?.email as string,
    params.noteId as string
  );

  const data = JSON.parse(olddata);

  async function updateNoteData(formData: FormData) {
    "use server";

    if (!user) throw new Error("Not Authorized!!!");

    const newTitle = formData.get("title") as string;
    const newDescription = formData.get("description") as string;
    await Note.updateOne(
      { _id: data._id },
      {
        $set: {
          title: newTitle,
          description: newDescription,
        },
      }
    );
    revalidatePath("/dashboard");
    return redirect("/dashboard");
  }
  return (
    <Card>
      <form action={updateNoteData}>
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
          <CardDescription>
            Right here you can now edit your note
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <div className="gap-y-2 flex flex-col">
            <Label>Title</Label>
            <Input
              required
              type="text"
              name="title"
              placeholder="Title of the note"
              defaultValue={data.title}
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label>Description</Label>
            <Textarea
              name="description"
              required
              placeholder="Describe about your note"
              defaultValue={data.description}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant={"destructive"} asChild>
            <Link href={"/dashboard"}>Cancel</Link>
          </Button>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
