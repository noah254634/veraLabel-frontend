import { NavItem } from "../../../shared/components/navigation/NavItem";
import { LogOut } from "lucide-react";
import {
    ShoppingCart,
  Home,
  Database,
  Layers,
  Bell,
  User,
  Tag,
  Filter,
  Search,
  Trash2,
  CreditCard,
  DownloadCloud,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
function BuyerSideBar() {
  return (
    <nav>
        <NavItem to="/buyer" label="Dashboard" icon={<User />} />
        <NavItem to="/buyer/browse" label="Browse" icon={<Search />} />
        <NavItem to="/buyer/cart" label="Cart" icon={<ShoppingCart />} />
        <NavItem to="/buyer/checkout" label="Checkout" icon={<CreditCard />} />
        <NavItem to="/buyer/order" label="Orders" icon={<ShoppingCart/>} />
        <NavItem to="/buyer/settings" label="Settings" icon={<Bell/>} />
  </nav>
  )
}

export default BuyerSideBar;