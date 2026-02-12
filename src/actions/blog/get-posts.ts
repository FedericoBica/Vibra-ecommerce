// src/actions/blog/get-post-by-slug.ts
"use server";
import prisma from "@/lib/prisma";

//  Para la lista principal (Grid)
export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' }
    });
    return posts;
  } catch (error) {
    return [];
  }
};