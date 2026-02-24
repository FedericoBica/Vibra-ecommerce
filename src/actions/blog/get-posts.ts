// src/actions/blog/get-post-by-slug.ts
"use server";
import { Post } from "@/interfaces";
import prisma from "@/lib/prisma";

//  Para la lista principal (Grid)
export const getPosts = async (): Promise<Post[]> => {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' }
    });
    return posts as Post[];
  } catch (error) {
    return [];
  }
};