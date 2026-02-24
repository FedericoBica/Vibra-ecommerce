import { getPostBySlug } from "@/actions/blog/get-post-by-slug";
import Image from "next/image";
import { notFound } from "next/navigation";
import { titleFont } from "@/config/fonts";
import { Post } from "@/interfaces";

interface Props {
  params: {
    slug: string;
  };
}

export default async function PostBySlugPage({ params }: Props) {
  const { slug } = params;
  const post = await getPostBySlug(slug) as Post | null;

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen pb-20">
      {/* Header del Post */}
      <header className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo con overlay */}
        <Image
          src={post.image || '/imgs/placeholder.jpg'}
          alt={post.title}
          fill
          className="object-cover transition-scale duration-700"
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        
        {/* Título y Metadata sobre la imagen */}
        <div className="relative z-10 px-5 text-center max-w-4xl">
          <div className="flex justify-center gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="bg-pink-600/20 border border-pink-500/50 text-pink-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
          <h1 className={`${titleFont.className} text-4xl md:text-6xl font-black text-white leading-tight mb-4`}>
            {post.title}
          </h1>
          <p className="text-zinc-300 text-lg italic max-w-2xl mx-auto">
            {post.excerpt}
          </p>
        </div>
      </header>

      {/* Contenido del Artículo */}
      <div className="max-w-3xl mx-auto px-5 mt-12">
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-zinc-800">
            <div className="text-sm text-zinc-500">
                Publicado el {post.createdAt.toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
        </div>

        {/* El contenido propiamente dicho */}
        <div 
          className="prose prose-invert prose-pink max-w-none 
          text-zinc-300 leading-relaxed text-lg
          prose-headings:text-white prose-headings:font-bold
          prose-strong:text-pink-500 prose-a:text-pink-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Footer del artículo */}
        <div className="mt-16 p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 text-center">
            <h4 className="text-white font-bold mb-2">¿Te gustó este artículo?</h4>
            <p className="text-zinc-400 text-sm">Compartilo con alguien que lo necesite o seguí explorando nuestra tienda.</p>
        </div>
      </div>
    </article>
  );
}