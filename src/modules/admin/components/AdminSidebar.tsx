import React from "react";
import { NavItem } from "../../../shared/components/navigation/NavItem";
import {
  FaTachometerAlt,
  FaDatabase,
  FaRobot,
  FaProjectDiagram,
  FaUsers,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import LogoutButton from "../../auth/logout";
export const AdminSidebar = () => {
  return (

    <nav>
      <NavItem
        to="/admin/dashboard"
        label="Dashboard"
        icon={<FaTachometerAlt />}
      />
      <NavItem to="/admin/datasets" label="Datasets" icon={<FaDatabase />} />
      <NavItem to="/admin/models" label="Models" icon={<FaRobot />} />
      <NavItem
        to="/admin/projects"
        label="Projects"
        icon={<FaProjectDiagram />}
      />
      <NavItem to="/admin/users" label="Users" icon={<FaUsers />} />
      <NavItem to="/admin/settings" label="Settings" icon={<FaCog />} />
      <NavItem to="/admin/help" label="Help" icon={<FaQuestionCircle />} />
      <LogoutButton />
    </nav>
  );
};
