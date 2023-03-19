import background from "../assets/uniBG.jpg";
import { CREDIT_DATA } from "../components/credit.constant";
const Credits = () => {
  return (
    <div className="h-screen bg-white text-black">
      <div className="h-[45%] relative text-white">
        <img
          src={background}
          alt="background image"
          className="w-full h-full filter brightness-50"
        />
        <h1 className="text-8xl absolute font-black font-display top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          SH34
        </h1>
      </div>
      <div className="flex flex-col items-center text-center pt-4">
        <h1 className="font-semibold text-xl">Our team</h1>
        <span className="w-2/6">
          {CREDIT_DATA.description}
          <a href="https://www.gla.ac.uk" className="text-blue-600 underline">
            {CREDIT_DATA.uni}
          </a>
        </span>
        <h1 className="font-semibold text-lg pt-2">Members</h1>
        {CREDIT_DATA.members.map((member) => {
          return <p key={member}>{member}</p>;
        })}
        <h1 className="font-semibold text-lg pt-2">Customer</h1>
        <p className="">{CREDIT_DATA.customer}</p>
      </div>
    </div>
  );
};

export default Credits;
