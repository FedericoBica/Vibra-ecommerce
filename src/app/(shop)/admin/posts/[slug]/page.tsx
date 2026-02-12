// src/app/admin/posts/[slug]/page.tsx
import { getPostBySlug } from "@/actions/blog/get-post-by-slug";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { PostForm } from "./ui/PostForm";

interface Props {
  params: { slug: string };
}

export default async function AdminPostPage({ params }: Props) {
  const { slug } = params;
  
  // Si es "new", pasamos un objeto vacío, sino buscamos el post
    const post = slug === "new" 
        ? { title: '', slug: '', excerpt: '', content: '', image: '', tags: [], isPublished: false } 
        : await getPostBySlug(slug);

  if (slug !== "new" && !post) {
    redirect("/admin/posts");
  }

  return (
    <div className="px-5 mb-20">
      <Title title={slug === "new" ? "Nuevo Artículo" : "Editar Artículo"} />
      <PostForm post={post ?? {}} />
    </div>
  );
}