// src/actions/blog/create-update-post.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Post } from "@/interfaces";

export const createUpdatePost = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const postId = data.id as string;

  const postData = {
    title: data.title as string,
    slug: data.slug as string,
    excerpt: data.excerpt as string,
    content: data.content as string,
    image: data.image as string,
    isPublished: data.isPublished === "on",
    // Convertimos "sexo, salud, juguetes" -> ["sexo", "salud", "juguetes"]
    tags: (data.tags as string).split(',').map(tag => tag.trim().toLowerCase()),
  };

  try {
    if (postId) {
      // Actualizar
      await prisma.post.update({
        where: { id: postId },
        data: postData,
      });
    } else {
      // Crear
      await prisma.post.create({
        data: postData,
      });
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${postData.slug}`);
    revalidatePath("/admin/posts");

    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "No se pudo guardar el post" };
  }
};