import { useMutation, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useConvexUpload() {
  const convex = useConvex();
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  /**
   * Upload a file to Convex storage
   * @param file - The file to upload
   * @returns The storage ID of the uploaded file
   */

  const uploadImage = async (file: File): Promise<string> => {
  
    // get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    // POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!result.ok) {
      throw new Error(`Upload failed: ${result.statusText}`);
    }

    const response = await result.json();
    const { storageId } = response;

    // return the storage ID
    return storageId;
  };

  return { uploadImage };
}