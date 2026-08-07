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


export const editMenuSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  icon: z.string().trim().min(1, "Icon is required"),
  order: z.number().min(1),
  path: z.string().trim().optional(),
  parentId: z.string().optional(),
})

export type EditMenuFormValues = z.infer<typeof editMenuSchema>

export const createPermissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().min(1, "Slug is required"),
})

export type CreatePermissionFormValues = z.infer<typeof createPermissionSchema>

export const editPermissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
})

export type EditPermissionFormValues = z.infer<typeof editPermissionSchema>

export const createRoleSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  organizationType: z.string().min(1, "Organization type is required"),
  isSystem: z.boolean(),
  organizationId: z.string().trim().optional(),
}).refine(
  (data) => data.isSystem || (!!data.organizationId && data.organizationId.length > 0),
  { message: "Organization ID is required for custom roles", path: ["organizationId"] },
)

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>

export const editRoleSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
})

export type EditRoleFormValues = z.infer<typeof editRoleSchema>