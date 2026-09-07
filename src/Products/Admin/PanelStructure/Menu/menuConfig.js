// src/Products/Admin/MENU/menuConfig.js
import { LayoutDashboard, Users, ShoppingCart, DollarSign, PieChart, MessageCircle, Layers, Settings } from "lucide-react";

export const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Analytics", icon: PieChart, path: "/admin/analytics" },
  { label: "Users", icon: Users, path: "/admin/users" },
  {
    label: "Ecommerce",
    icon: ShoppingCart,
    submenu: [
      { label: "Add Product", path: "/admin/add-product" },
      { label: "Edit Product", path: "/admin/edit-product" },
      { label: "Product Payment", path: "/admin/payment" },
      { label: "Stock", path: "/admin/stock" },
      { label: "Out of Stock", path: "/admin/out-of-stock" },
    ],
  },
  {
    label: "Transactions",
    icon: DollarSign,
    submenu: [
      { label: "Payments", path: "/admin/transactions/payments" },
      { label: "Number of Orders", path: "/admin/transactions/orders" },
      { label: "Payment Received", path: "/admin/transactions/received" },
    ],
  },
  { label: "Messages", icon: MessageCircle, path: "/admin/messages" },
  { label: "Charts", icon: Layers, path: "/admin/charts" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];
