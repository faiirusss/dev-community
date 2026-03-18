import { Ellipsis, X } from "lucide-react";
import { Button } from "~/components/ui/button";

export function BannerCard() {
 return (
   <div className="bg-card rounded-md">
     <div className="flex justify-between px-4 pt-5 items-center">
       <span className="text-sm text-foreground/70">👋 DEV Challenges</span>
       <div className="flex">
         <Button className="cursor-pointer" size="icon" variant="ghost">
           <Ellipsis />
         </Button>
         <Button className="cursor-pointer" size="icon" variant="ghost">
           <X />
         </Button>
       </div>
     </div>
     <div className="px-14">
       <img
         src="https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fekpfy5pcfkyf7vmmfch6.png"
         alt="Challenge banner"
         className="rounded-md"
       />
       <h2 className="font-bold py-4 text-xl">Deadline Extended!</h2>
       <div className="border border-border p-8 space-y-1 rounded-md">
         <p className="font-bold text-xl">
           Join the Bright Data Real-Time AI Agents Challenge: $3,000 in
           prizes!
         </p>
         <p className="text-sm text-foreground/70 font-semibold">
           dev.to staff for The DEV Team <span>— May 7</span>
         </p>
         <div className="flex text-xs gap-2 text-muted-foreground">
           <p>#brightdatachallenge</p>
           <p>#devchallenge</p>
           <p>#ai</p>
           <p>#webdev</p>
         </div>
       </div>
       <p className="py-4">Gooooood luck!</p>
     </div>
   </div>
 );
}