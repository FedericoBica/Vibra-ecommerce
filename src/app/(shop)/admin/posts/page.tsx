// src/app/admin/posts/page.tsx
import Link from 'next/link';
import { Title } from '@/components';
import { getAllPosts } from '@/actions';
import { IoCardOutline, IoAddOutline, IoCheckmarkCircleOutline, IoEllipseOutline } from 'react-icons/io5';
import clsx from 'clsx';

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="px-5 mb-20">
      <div className="flex justify-between items-center mb-10">
        <Title title="Administración de Blog" />
        
        <Link 
          href="/admin/posts/new" 
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-5 py-2 rounded-xl transition-all font-bold uppercase text-xs tracking-widest"
        >
          <IoAddOutline size={20} />
          Nuevo Artículo
        </Link>
      </div>

      <div className="overflow-x-auto bg-zinc-900/50 rounded-3xl border border-zinc-800">
        <table className="min-w-full text-left">
          <thead className="border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 text-zinc-500 font-bold uppercase text-xs tracking-widest">Estado</th>
              <th className="px-6 py-4 text-zinc-500 font-bold uppercase text-xs tracking-widest">Título</th>
              <th className="px-6 py-4 text-zinc-500 font-bold uppercase text-xs tracking-widest">Tags</th>
              <th className="px-6 py-4 text-zinc-500 font-bold uppercase text-xs tracking-widest">Fecha</th>
              <th className="px-6 py-4 text-zinc-500 font-bold uppercase text-xs tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group">
                <td className="px-6 py-4">
                  {post.isPublished ? (
                    <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                      <IoCheckmarkCircleOutline /> Publicado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-zinc-500 text-xs font-bold italic">
                      <IoEllipseOutline /> Borrador
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-100 font-medium group-hover:text-pink-400 transition-colors">
                    {post.title}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && <span className="text-[10px] text-zinc-600">+{post.tags.length - 2}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-500 text-xs">
                  {post.createdAt.toLocaleDateString('es-UY')}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    href={`/admin/posts/${post.slug}`}
                    className="text-pink-500 hover:text-pink-400 font-bold text-xs uppercase underline underline-offset-4"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-20 text-zinc-500 italic">
            Todavía no escribiste ningún artículo. ¡Empezá hoy!
          </div>
        )}
      </div>
    </div>
  );
}