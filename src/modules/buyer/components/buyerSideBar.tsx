import { NavItem } from "../../../shared/components/navigation/NavItem";
import {
  User,
  Search,
  ShoppingCart,
  CreditCard,
  ClipboardList,
  Settings,
} from "lucide-react";

function BuyerSideBar() {
  return (
    <nav>
        <NavItem to="/buyer" label="Dashboard" icon={<User />} end/>
        <NavItem to="/buyer/browse" label="Browse" icon={<Search />} />
        <NavItem to="/buyer/cart" label="Cart" icon={<ShoppingCart />} />
        <NavItem to="/buyer/checkout" label="Checkout" icon={<CreditCard />} />
        <NavItem to="/buyer/order" label="Orders" icon={<ClipboardList />} />
        <NavItem to="/buyer/settings" label="Settings" icon={<Settings />} />
  </nav>
  )
}

export default BuyerSideBar;