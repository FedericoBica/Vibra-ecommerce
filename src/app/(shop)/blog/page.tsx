// src/app/(shop)/blog/page.tsx
import { getPosts } from "@/actions"; // Importamos la función plural
import { PostCard } from "@/components/blog/PostCard";
import { Title } from "@/components";

export const revalidate = 3600; 

export default async function BlogPage() {
  // Llamamos a getPosts() que devuelve el array de artículos
  const posts = await getPosts();

  return (
    <div className="px-5 mb-20 max-w-[1200px] mx-auto min-h-screen">
      <Title 
        title="Vibra Blog" 
        subtitle="Explorá, aprendé y descubrí nuevas sensaciones."
        className="mb-10"
      />

      {/* Verificamos que posts sea un array y tenga contenido */}
      { (posts && posts.length > 0) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 p-10 border border-dashed border-zinc-800 rounded-3xl">
          <span className="text-4xl mb-4">✍️</span>
          <p className="text-zinc-500 italic">Estamos preparando contenido increíble para vos...</p>
        </div>
      )}
    </div>
  );
}