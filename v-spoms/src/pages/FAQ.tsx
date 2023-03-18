import { FAQ_DATA } from "../components/faq.constant";
import { VscSearch } from "react-icons/vsc";
import Dropdown from "../components/Dropdown";
import { useState } from "react";

const FAQ = () => {
  const [searchText, setSearchText] = useState<string>("");
  return (
    <div className="bg-white text-black">
      <div className="bg-light-blue h-72 w-full flex-col pt-14 pl-16">
        <h1 className="font-semibold text-5xl pb-3">
          Frequently Asked Questions
        </h1>
        <p>You will find most answers here.</p>
        <p className="pb-3">
          However, if you can't them then we recommand you contact the GitHub page&nbsp;
          <a href="https://github.com/CS-UOG-SH34-2022/V-Spoms"
            target="_blank"
            rel="noopener"
          >
            <u><i>here</i></u>
          </a>.
        </p>
        <div className="relative flex items-center">
          <div className="absolute ml-3">
            <VscSearch />
          </div>
          <input
            placeholder="search..."
            type="text"
            className="pl-10 rounded-3xl w-2/5 h-10 border-black border-2 outline-none bg-white"
            onChange={(e: { target: { value: any; }; }) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <div className="py-12 mx-20 pb-5 h-full">
        {FAQ_DATA.filter((faq) => {
          if (searchText == "") {
            return faq;
          } else if (
            faq.question.toLowerCase().includes(searchText.toLowerCase())
          ) {
            return faq;
          }
        }).map((faq) => {
          return (
            <Dropdown
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
