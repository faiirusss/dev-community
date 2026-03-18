import { Bookmark, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";

export function PostCard({ username }: { username: string }) {
 return (
   <div className="bg-card rounded-md">
     {/* Cover Image */}
     <img
       src="https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ftqnkkzw25yftwhrtuduy.png"
       alt="Post cover"
       className="w-full rounded-t-md"
     />

     {/* Author Info */}
     <div className="flex items-center gap-2 p-4">
       <Avatar>
         <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
         <AvatarFallback>CN</AvatarFallback>
       </Avatar>
       <div>
         <p className="font-medium text-sm">{username}</p>
         <p className="text-xs text-foreground/70">
           May 16 (13 hours ago)
         </p>
       </div>
     </div>

     {/* Post Content */}
     <div className="pl-14 space-y-4">
       <h1 className="text-3xl font-bold">
         You can replace popular frameworks using these methods! 🔥
       </h1>
       <div className="flex text-xs gap-2 text-muted-foreground">
         <p>#brightdatachallenge</p>
         <p>#devchallenge</p>
         <p>#ai</p>
         <p>#webdev</p>
       </div>

       {/* Reactions Row */}
       <div className="flex items-center justify-between mr-4">
         <div className="flex">
           <Button variant="ghost" className="relative w-56 cursor-pointer">
             <div>
               <p className="absolute left-2 z-50 top-1/2 -translate-y-1/2 border-2 border-card bg-accent rounded-full p-1">
                 💖
               </p>
               <p className="absolute left-7 z-40 top-1/2 -translate-y-1/2 border-2 border-card bg-accent rounded-full p-1">
                 🦄
               </p>
               <p className="absolute left-12 z-30 top-1/2 -translate-y-1/2 border-2 border-card bg-accent rounded-full p-1">
                 🤯
               </p>
               <p className="absolute left-[4.25rem] z-20 top-1/2 -translate-y-1/2 border-2 border-card bg-accent rounded-full p-1">
                 🙌
               </p>
               <p className="absolute left-[5.5rem] z-10 top-1/2 -translate-y-1/2 border-2 border-card bg-accent rounded-full p-1">
                 🔥
               </p>
             </div>
             <p className="ml-26 text-sm text-foreground/80">
               110 Reactions
             </p>
           </Button>
           <Button variant="ghost" className="cursor-pointer">
             <MessageSquare className="size-4" />
             3 Comments
           </Button>
         </div>
         <Button size="icon" variant="ghost" className="cursor-pointer">
           <Bookmark />
         </Button>
       </div>
     </div>

     {/* Comment Preview */}
     <div className="flex items-start gap-2 p-4">
       <Avatar>
         <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
         <AvatarFallback>CN</AvatarFallback>
       </Avatar>
       <div className="bg-foreground/5 rounded-sm p-4 text-sm space-y-2">
         <p className="font-semibold text-base">
           {username}{" "}
           <span className="text-foreground/70 font-normal text-sm">
             7 Hours ago
           </span>
         </p>
         <p>
           pretty cool seeing someone call out the basics like this - i always
           feel like we forget how much can be done just by keeping things
           simple
         </p>
         <p>
           you ever notice how sometimes old tools end up working even better
           when things get too complicated?
         </p>
       </div>
     </div>

     {/* See All Comments */}
     <div className="pl-14 pb-4">
       <Button variant="ghost" className="cursor-pointer">
         See all 16 comments
       </Button>
     </div>
   </div>
 );
}