import { Button } from "~/components/ui/button";
import { BannerCard } from "./BannerCard";
import { PostCard } from "./PostCard";

export function MainFeed({ username }: { username: string }) {
 return (
   <section className="space-y-2 mb-50">     
     <div className="bg-card p-2 rounded-md">
       <input
         className="border border-border w-full p-2 rounded-md bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
         placeholder="What's on your mind?"
       />
     </div>

     <div>
       <Button className="cursor-pointer">Discover</Button>
       <Button variant="ghost" className="cursor-pointer">
         Following
       </Button>
     </div>
     <BannerCard />
     <PostCard username={username} />
   </section>
 );
}