// src/actions/blog/get-all-posts.ts
"use server";
import prisma from "@/lib/prisma";

export const getAllPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return posts;
  } catch (error) {
    return [];
  }
};