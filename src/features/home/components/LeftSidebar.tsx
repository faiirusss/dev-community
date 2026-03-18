import { Link } from "@tanstack/react-router";

export function LeftSidebar() {
 const navItems = [
   { emoji: "🏠", label: "Home", to: "/" },
   { emoji: "📖", label: "Reading List", to: "/" },
   { emoji: "🏷️", label: "Tags", to: "/" },
   { emoji: "💡", label: "FAQ", to: "/" },
   { emoji: "😎", label: "About", to: "/" },
 ];

 return (
   <section className="hidden md:block">
     <div>
       {navItems.map((item) => (
         <Link
           key={item.label}
           to={item.to}
           className="flex items-center gap-2 p-2 hover:bg-foreground/5 rounded-md transition-colors"
         >
           <span className="text-xl">{item.emoji}</span>
           <span>{item.label}</span>
         </Link>
       ))}
     </div>
   </section>
 );
}