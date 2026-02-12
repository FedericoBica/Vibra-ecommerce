// src/components/blog/PostCard.tsx
import { Post } from '@/interfaces';
import Image from 'next/image';
import Link from 'next/link';


interface Props {
  post: Post;
}

export const PostCard = ({ post }: Props) => {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all group flex flex-col h-full">
      <div className="relative h-52 w-full overflow-hidden bg-zinc-800">
        <Image 
          src={post.image || '/imgs/placeholder.jpg'} 
          alt={post.title} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex gap-2 mb-3">
          {post.tags?.map(tag => (
            <span key={tag} className="text-[10px] bg-pink-500/10 text-pink-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-bold text-gray-100 group-hover:text-pink-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-zinc-400 text-sm mt-3 line-clamp-3 italic">
          {post.excerpt}
        </p>
        <div className="mt-auto pt-6">
          <Link 
            href={`/blog/${post.slug}`}
            className="text-sm font-black text-white uppercase tracking-widest hover:text-pink-500 transition-colors flex items-center gap-2"
          >
            Leer artículo <span className="text-pink-500">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};