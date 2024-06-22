"use server";

import User from "@/models/userModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export async function profileChanges(formData: FormData) {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const color = formData.get("color") as string;

  await User.updateOne(
    {
      email: user?.email as string,
    },
    {
      $set: {
        firstName,
        lastName,
        colorScheme: color,
      },
    }
  );

  revalidatePath("/", "layout");
}
