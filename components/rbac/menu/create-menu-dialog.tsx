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
import { ReactSelectSingle } from "@/components/ui/react-select"
import { useCreateMenu, useAllMenus } from "@/hooks/use-rbac"
import { CreateMenuFormValues, createMenuSchema } from "@/lib/validations/rbac"
import { Can } from "@/components/common"
import type { MenuItem } from "@/types"


function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export function CreateMenuDialog() {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useCreateMenu()
  const { data: menusData } = useAllMenus()

  const parentOptions = (menusData?.items ?? []).map((m: MenuItem) => ({
    label: m.name,
    value: m.id,
  }))

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateMenuFormValues>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: { order: 1 },
  })

  async function onSubmit(values: CreateMenuFormValues) {
    toast.promise(
      mutateAsync({
        name: values.name,
        slug: values.slug,
        icon: values.icon,
        order: values.order,
        path: values.path || null,
        parentId: values.parentId || null,
      }),
      {
        loading: "Please wait...",
        success: () => {
          setOpen(false)
          reset()
          return "Menu created"
        },
        error: "Failed to create menu",
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset() }}>
      <DialogTrigger asChild>
        <Can menu="menus" permission="create">
          <Button>
            Create Menu
          </Button>
        </Can>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Menu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Name</Label>
            <Input
              placeholder="e.g. Operators"
              {...register("name", {
                onChange: (e) => setValue("slug", toSlug(e.target.value)),
              })}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Slug</Label>
            <Input placeholder="e.g. operators" {...register("slug")} />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>

          {/* Icon */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Icon</Label>
            <Input placeholder="e.g. user-cog" {...register("icon")} />
            {errors.icon && <p className="text-xs text-destructive">{errors.icon.message}</p>}
          </div>

          {/* Order */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Order</Label>
            <Input type="number" min={1} placeholder="1" {...register("order", { valueAsNumber: true })} />
            {errors.order && <p className="text-xs text-destructive">{errors.order.message}</p>}
          </div>

          {/* Path */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Path <span className="text-muted-foreground">(optional)</span></Label>
            <Input placeholder="e.g. /organizations/operators" {...register("path")} />
          </div>

          {/* Parent */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Parent <span className="text-muted-foreground">(optional)</span></Label>
            <ReactSelectSingle
              options={parentOptions}
              onChange={(opt) => setValue("parentId", opt?.value ?? "")}
              placeholder="Select parent menu"
              isClearable
            />
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
