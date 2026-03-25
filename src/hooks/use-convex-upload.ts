import { useMutation, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useConvexUpload() {
  const convex = useConvex();
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const uploadImage = async (file: File): Promise<string> => {
    
    // get upload url from convex
    const postUrl = await generateUploadUrl();

    // upload image to convex
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!result.ok) throw new Error(`Upload failed: ${result.statusText}`);
    const { storageId } = await result.json();

    // get public url from convex
    const url = await convex.query(api.storage.getUrl, { storageId });
    if (!url) throw new Error("Could not retrieve image URL from Convex");
    
    // return public url
    return url; 
  };

  return { uploadImage };
}