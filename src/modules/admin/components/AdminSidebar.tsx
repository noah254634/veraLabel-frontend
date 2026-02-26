import React from "react";
import AdminDashboard from "../pages/Dashboard";
import { NavItem } from "../../../shared/components/navigation/NavItem";
import {
  Gauge,
  Database,
  Bot,
  Layers,
  Users,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

import LogoutButton from "../../auth/logout";
export const AdminSidebar = () => {
  return (

    <nav>
      <NavItem
        to="/admin/dashboard"
        label="Dashboard"
        icon={<Gauge />}
      />
      <NavItem to="/admin/datasets" label="Datasets" icon={<Layers />} />
      <NavItem to="/admin/models" label="Models" icon={<Bot />} />
      <NavItem
        to="/admin/projects"
        label="Projects"
        icon={<Database />}
      />
      <NavItem to="/admin/users" label="Users" icon={<Users />} />
      <NavItem to="/admin/settings" label="Settings" icon={<Settings />} />
      <NavItem to="/admin/help" label="Help" icon={<HelpCircle/>} />
      <LogoutButton />
    </nav>
  );
};
