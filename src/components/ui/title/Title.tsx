import { titleFont } from '@/config/fonts';

interface Props {
  title: string;
  subtitle?: string;
  className?: string;
}



export const Title = ({ title, subtitle, className }: Props) => {
  return (
    <div className={ `mt-3 px-4 sm:px-0 ${ className }` }>
      <h1 className={ `antialiased text-3xl sm:text-4xl font-semibold my-5 text-gray-100` }>
        { title }
      </h1>

      {
        subtitle && (
          <h3 className="text-xl mb-5 text-pink-500/80">{ subtitle }</h3>
        )
      }

    </div>
  )
}