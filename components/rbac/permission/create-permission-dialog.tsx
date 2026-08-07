"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCreatePermission } from "@/hooks/use-rbac"
import { createPermissionSchema, CreatePermissionFormValues } from "@/lib/validations/rbac"

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export function CreatePermissionDialog() {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useCreatePermission()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatePermissionFormValues>({
    resolver: zodResolver(createPermissionSchema),
  })

  async function onSubmit(values: CreatePermissionFormValues) {
    toast.promise(
      mutateAsync({ name: values.name, slug: values.slug }),
      {
        loading: "Please wait...",
        success: () => {
          setOpen(false)
          reset()
          return "Permission created"
        },
        error: "Failed to create permission",
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset() }}>
      <DialogTrigger asChild>
        <Button>Create Permission</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Permission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Name</Label>
            <Input
              placeholder="e.g. Suspend"
              {...register("name", {
                onChange: (e) => setValue("slug", toSlug(e.target.value)),
              })}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Slug</Label>
            <Input placeholder="e.g. suspend" {...register("slug")} />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => { setOpen(false); reset() }}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
