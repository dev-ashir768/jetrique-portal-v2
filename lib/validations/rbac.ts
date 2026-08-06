import z from "zod"

export const createMenuSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  icon: z.string().trim().min(1, "Icon is required"),
  order: z.number().int().min(1, "Order must be at least 1"),
  path: z.string().trim().optional(),
  parentId: z.string().optional(),
})

export type CreateMenuFormValues = z.infer<typeof createMenuSchema>
