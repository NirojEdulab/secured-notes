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
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewNotePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  async function saveNoteData(formData: FormData) {
    "use server";

    const userData = await User.findOne({
      email: user?.email,
    });

    if (!userData) {
      throw new Error("Not Authorized!!!");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const newNote = new Note({
      title,
      description,
      userId: userData._id,
    });

    await newNote.save();

    return redirect("/dashboard");
  }
  return (
    <Card>
      <form action={saveNoteData}>
        <CardHeader>
          <CardTitle>New Note</CardTitle>
          <CardDescription>
            Right here you can now create your new note
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
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label>Description</Label>
            <Textarea
              name="description"
              required
              placeholder="Describe about your note"
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
