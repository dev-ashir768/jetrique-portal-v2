import z from "zod"

export const createMenuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().min(1, "Icon is required"),
  order: z.coerce.number().int().min(1, "Order must be at least 1"),
  path: z.string().optional(),
  parentId: z.string().optional(),
})

export type CreateMenuFormValues = z.infer<typeof createMenuSchema>