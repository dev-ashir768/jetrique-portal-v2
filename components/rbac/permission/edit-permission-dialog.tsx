"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUpdatePermission } from "@/hooks/use-rbac"
import { editPermissionSchema, EditPermissionFormValues } from "@/lib/validations/rbac"
import type { Permission } from "@/types"

interface Props {
  permission: Permission
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPermissionDialog({ permission, open, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useUpdatePermission(permission.id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditPermissionFormValues>({
    resolver: zodResolver(editPermissionSchema),
  })

  useEffect(() => {
    if (open) {
      reset({ name: permission.name })
    }
  }, [open, permission, reset])

  async function onSubmit(values: EditPermissionFormValues) {
    await mutateAsync({ name: values.name })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onOpenChange(false) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Permission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Name</Label>
            <Input {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating…" : "Update"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
