import Sidebar from "../components/Sidebar"
import { DOCS_DATA, INTRO } from "../components/docs.constant"


const Docs = () => {
    const contents = DOCS_DATA.map(content => {
        return (
            <section className="mx-14 my-6" key={content.title}>
                <h1 id={content.title} className="font-bold text-2xl">{content.title}</h1>
                <h1 className="font-bold text-xl">{content.equation}</h1>
                <h3 className="text-zinc-600 py-2 font-semibold">Parameter</h3>
                <div className="px-2">
                    {content.parameters.map(bullet => (
                        <li key={bullet.definition}><span className="font-bold">{bullet.variable}</span> {bullet.definition}</li>
                    ))}
                </div>
                <h3 className="text-zinc-600 py-2 font-semibold">Usage</h3>
                <p>{content.usage}</p>


            </section>
        )
    })
    return (
        <div className="flex bg-white text-black">
            <Sidebar DATA={DOCS_DATA} />
            <div className="pb-5">
                <h1 className="font-bold text-3xl mx-14 my-1 mt-10">{INTRO.title}</h1>
                <p className="mx-14 mt-1">{INTRO.content}</p>
                {contents}
            </div>

        </div>
    )
}

export default Docs
