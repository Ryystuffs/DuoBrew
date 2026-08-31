export type NavItem = {
    label: string;
    href: string;
    role: Array<"admin" | "manager" | "cashier">;
};

export const navItems: NavItem[] = [
    {label: "POS", href: "/pos" , role: ["admin", "manager", "cashier"]},
    {label: "Categories", href: "/categories" , role: ["admin", "manager"]},
    {label: "Menu", href: "/menu" , role: ["admin", "manager"]},
    {label: "Sales", href: "/sales" , role: ["admin", "manager"]},
    {label: "Reports", href: "/reports" , role: ["admin", "manager"]},
    {label: "Settings", href: "/settings" , role: ["admin"]},
]