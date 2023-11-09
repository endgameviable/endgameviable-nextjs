import Entry from '@/data/interfaces/entry'
import SingleEntryLayout from '@/layouts/entrySingle'
import { TextType } from '@/data/interfaces/types'

/* Single page display the content slug */
export default function Page({ params }: { params: { route: string[] } }) {
    const source = params.route[0]
    const slug = params.route[params.route.length-1]
    
    return (
      <main>
        <p>source: {source}</p>
        {params.route.slice(1,params.route.length-1).map((s) =>
          { return (<p key={s}>{s}</p>) }
        )}
        <p>slug: {slug}</p>
      </main>
    )
}
