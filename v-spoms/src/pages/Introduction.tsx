import Sidebar from "../components/Sidebar";
import { INTRO_DATA } from "../components/intro.constant";
import { INTRODUCTION } from "../components/intro.constant";
const Introduction = () => {
  const contents = INTRO_DATA.map((content) => {
    if (content.childrens) {
      return (
        <section className="mx-14" key={content.title}>
          <h1 id={content.title} className="font-bold text-2xl pt-6">
            {content.title}
          </h1>
          <p className="text-md mt-2">{content.content}</p>
          {content.childrens.map((sub_content) => {
            return (
              <section key={sub_content.title}>
                <h1
                  id={sub_content.title}
                  className="text-lg pt-1 font-semibold"
                >
                  {sub_content.title}
                </h1>
                <p className="w-4/5 pb-3 pt-2">{sub_content.content}</p>
              </section>
            );
          })}
        </section>
      );
    } else {
      return (
        <section className="mx-14" key={content.title}>
          <h1 id={content.title} className="font-bold text-2xl pt-6">
            {content.title}
          </h1>
          <p className="w-4/5 mt-2">{content.content}</p>
        </section>
      );
    }
  });

  return (
    <div className="flex h-auto bg-white text-black">
      <Sidebar DATA={INTRO_DATA} />
      <div className="pb-5">
        <h1 className="font-bold text-3xl mx-14 my-1 mt-10">
          {INTRODUCTION.title}
        </h1>
        <p className="mx-14 w-4/5 mt-2">{INTRODUCTION.content}</p>
        {contents}
      </div>
    </div>
  );
};

export default Introduction;
