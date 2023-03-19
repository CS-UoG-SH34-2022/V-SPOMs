import { useState } from "react";
import { Link } from "react-scroll";
import { intro } from "./intro.constant";
import { docs } from "./docs.constant";
import { AiOutlineDown } from "react-icons/ai";
interface Props {
  item: intro | docs;
}

const SidebarItem = ({ item }: Props) => {
  const [open, setOpen] = useState(false);
  const setColor = open ? "blue" : "black";
  if (item.childrens) {
    return (
      <div className="px-4 py-3 block">
        <div className="flex text-base justify-between">
          <Link to={item.title} smooth={true} duration={300}>
            <span className="hover:text-main-blue cursor-pointer font-medium">
              {item.title}
            </span>
          </Link>

          <div
            className={open ? "cursor-pointer rotate-180" : "cursor-pointer"}
            onClick={() => setOpen(!open)}
          >
            <AiOutlineDown color={setColor} />
          </div>
        </div>
        <div className={open ? "h-auto" : "pt-1 h-0 hidden"}>
          {item.childrens.map((child, index) => (
            <SidebarItem key={index} item={child} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="px-4 py-3 block hover:bg-white">
        <div className="flex text-md justify-between">
          <Link to={item.title} smooth={true} duration={300}>
            <span className="hover:text-main-blue cursor-pointer font-medium">
              {item.title}
            </span>
          </Link>
        </div>
      </div>
    );
  }
};

export default SidebarItem;
