import { z } from "zod";

// Zod schema for file validation
export const FileSchema = z.object({
  id: z.string(),
  file: z.instanceof(File),
  preview: z.string().optional(),
  status: z.enum(['idle', 'uploading', 'success', 'error']),
  progress: z.number().min(0).max(100),
  error: z.string().optional(),
});

export type FileItem = z.infer<typeof FileSchema>;
