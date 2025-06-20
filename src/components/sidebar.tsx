import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { LogOut } from "lucide-react";
import Link from "next/link";

function SideButton({
  name,
  icon,
  link,
  isActive,
}: {
  name: string;
  icon: string;
  link: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={link}
      className={`w-full flex items-center gap-3 font-medium text-[#181D27] text-sm rounded-[6px] px-3 py-2 ${
        isActive ? "bg-gray-200" : "text-[#717680]"
      }`}
    >
      <img src={icon} alt="icon" className="w-5 h-5 flex " />
      {name}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <div className="w-full h-screen max-w-[256px] flex flex-col items-start justify-between gap-1 bg-white border-r-[1px] border-[#E9EAEB]">
      <div className="p-4">
        <img src="/logo.png" alt="company logo" className="w-32 mb-6" />
        <SideButton name="Home" icon="/icons/home.png" link="/home" isActive />
        <SideButton
          name="Endorsed Candidates"
          icon="/icons/user-star.png"
          link="/endorsed"
          isActive={false}
        />
        <SideButton
          name="Interview log"
          icon="/icons/message.png"
          link="/interview-log"
          isActive={false}
        />
        <SideButton
          name="User Management"
          icon="/icons/user-settings.png"
          link="/management"
          isActive={false}
        />
        <SideButton
          name="Hired Staff"
          icon="/icons/user-checked.png"
          link="/hired"
          isActive={false}
        />
        <SideButton
          name="Tickets"
          icon="/icons/ticket.png"
          link="/tickets"
          isActive={false}
        />
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="px-4">
          <div className="flex items-center justify-start gap-3 px-3 py-2">
            <img src="/icons/moon.jpg" alt="" />
            <span className="mr-10 text-[#717680] text-sm font-medium">Dark mode</span>
            <Switch className="cursor-pointer"/>
          </div>
          <SideButton
            name="Settings"
            icon="/icons/settings.jpg"
            link="/settings"
            isActive={false}
          />
        </div>
        <Separator/>
        <div className="flex items-center justify-center p-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGasA3GR9lZOu0QmGpOt_lz5f1o0hOJTD_RA&s"
            alt="profile"
            className="w-10 rounded-full mr-4"
          />
          <div className="flex flex-col mr-10">
            <span className="font-medium text-sm text-[#181D27]">
              Elizabeth Pascoe
            </span>
            <span className="font-medium text-xs text-[#717680]">
              Super Admin
            </span>
          </div>
          <button className="cursor-pointer">
            <LogOut size={16} color="gray" />
          </button>
        </div>
      </div>
    </div>
  );
}
