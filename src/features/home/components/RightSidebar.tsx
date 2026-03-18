import { Ellipsis } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export function RightSidebar() {
 return (
   <section className="space-y-4 hidden lg:block">
     {/* Active Discussions */}
     <div className="bg-card rounded-md py-4">
       <h2 className="font-bold text-lg px-4">Active discussions</h2>
       <Separator className="w-full my-3" />
       <div className="px-4">
         <p className="text-foreground/70">What was your win this week?</p>
         <p className="text-sm text-foreground/70">27 comments</p>
       </div>
       <Separator className="w-full my-3" />
       <div className="px-4">
         <p className="text-foreground/70">
           Build a Therapy Marketplace using Next.js and Firebase
         </p>
         <p className="text-sm text-foreground/70">9 comments</p>
       </div>
     </div>

     {/* What's Happening */}
     <div className="bg-card rounded-md p-4">
       <div className="flex justify-between items-center">
         <p className="text-sm text-foreground/70">
           👋 What's happening this week
         </p>
         <Button size="icon" variant="ghost">
           <Ellipsis />
         </Button>
       </div>
       <h2 className="text-lg font-semibold text-foreground/80">
         Challenges 🤗
       </h2>
       <div className="border-foreground/80 rounded-md p-3 border-2 space-y-3">
         <p>Happening Now 🌟</p>
         <img
           src="https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fekpfy5pcfkyf7vmmfch6.png"
           alt="Challenge"
           className="rounded-md"
         />
         <a href="#" className="underline font-bold text-foreground/90 block">
           Bright Data Real-Time AI Agents Challenge
         </a>
         <p className="italic font-normal text-foreground/80">
           Submissions Due May 25.
         </p>
       </div>
       <p className="pt-4 font-bold text-foreground/80">
         Have a great week ❤️
       </p>
     </div>
   </section>
 );
}