"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function checkPhoneNumber(phone?: string) {
  if (!phone) {
    return true;
  }

  const session = await getSession();

  const existingUser = await db.user.findFirst({
    where: {
      phone,
      NOT: session.id
        ? {
            id: session.id,
          }
        : undefined,
    },
    select: {
      id: true,
    },
  });

  // Return true if the phone is available (no other user has it)
  return !Boolean(existingUser);
}

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session.id) {
    return null;
  }

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const avatar = formData.get("avatar") as string;

  const updateData: {
    username?: string;
    password?: string;
    phone?: string;
    avatar?: string;
  } = {};

  if (username) {
    updateData.username = username;
  }

  if (phone) {
    updateData.phone = phone;
  }

  if (avatar) {
    updateData.avatar = avatar;
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    updateData.password = hashedPassword;
  }

  try {
    const data = await db.user.update({
      where: {
        id: session.id,
      },
      data: updateData,
    });
    revalidatePath("/profile");
    return data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    return null;
  }
}
