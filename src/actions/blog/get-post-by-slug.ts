import prisma from "@/lib/prisma";

// Para la página individual (Slug)
export const getPostBySlug = async (slug: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug }
    });
    return post;
  } catch (error) {
    return null;
  }
};