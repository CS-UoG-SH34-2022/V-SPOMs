import SidebarItem from "./SidebarItem";
import { intro } from "./intro.constant";
import { docs } from "./docs.constant";

interface Pros {
  DATA: intro[] | docs[];
}

const Sidebar = ({ DATA }: Pros) => {
  return (
    <div className="w-64 shrink-0 h-auto overflow-auto border-2">
      <div className="text-lg px-4 py-2 mt-7 hover:text-main-blue font-medium">
        Introduction
      </div>
      {DATA.map((item, index) => (
        <SidebarItem key={index} item={item} />
      ))}
    </div>
  );
};

export default Sidebar;
