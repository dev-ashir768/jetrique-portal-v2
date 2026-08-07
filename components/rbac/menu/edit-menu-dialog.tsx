"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ReactSelectSingle } from "@/components/ui/react-select"
import { useUpdateMenu, useAllMenus } from "@/hooks/use-rbac"
import type { MenuItem } from "@/types"
import { EditMenuFormValues, editMenuSchema } from "@/lib/validations/rbac"


function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

interface Props {
  menu: MenuItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditMenuDialog({ menu, open, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useUpdateMenu(menu.id)
  const { data: menusData } = useAllMenus()

  const parentOptions = (menusData?.items ?? [])
    .filter((m: MenuItem) => m.id !== menu.id)
    .map((m: MenuItem) => ({ label: m.name, value: m.id }))

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditMenuFormValues>({
    resolver: zodResolver(editMenuSchema),
  })

  useEffect(() => {
    if (open) {
      reset({
        name: menu.name,
        icon: menu.icon,
        order: menu.order,
        path: menu.path ?? "",
        parentId: menu.parentId ?? "",
      })
    }
  }, [open, menu, reset])

  async function onSubmit(values: EditMenuFormValues) {
    const payload: Record<string, unknown> = {
      name: values.name,
      icon: values.icon,
      order: values.order,
    }
    if (values.path) payload.path = values.path
    if (values.parentId) payload.parentId = values.parentId

    await mutateAsync(payload as Parameters<typeof mutateAsync>[0])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onOpenChange(false); else onOpenChange(true) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Name</Label>
            <Input
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Icon</Label>
            <Input {...register("icon")} />
            {errors.icon && <p className="text-xs text-destructive">{errors.icon.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Order</Label>
            <Input type="number" min={1} {...register("order", { valueAsNumber: true })} />
            {errors.order && <p className="text-xs text-destructive">{errors.order.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Path <span className="text-muted-foreground">(optional)</span></Label>
            <Input placeholder="e.g. /wallet/transactions" {...register("path")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Parent <span className="text-muted-foreground">(optional)</span></Label>
            <ReactSelectSingle
              options={parentOptions}
              defaultValue={parentOptions.find((o: { value: string }) => o.value === menu.parentId) ?? null}
              onChange={(opt) => setValue("parentId", opt?.value ?? "")}
              placeholder="Select parent menu"
              isClearable
            />
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating…" : "Update"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
