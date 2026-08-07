"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUpdateRole } from "@/hooks/use-rbac"
import { editRoleSchema, EditRoleFormValues } from "@/lib/validations/rbac"
import type { Role } from "@/types"

interface Props {
  role: Role
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditRoleDialog({ role, open, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useUpdateRole(role.id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditRoleFormValues>({
    resolver: zodResolver(editRoleSchema),
  })

  useEffect(() => {
    if (open) {
      reset({ name: role.name })
    }
  }, [open, role, reset])

  async function onSubmit(values: EditRoleFormValues) {
    await mutateAsync({ name: values.name })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onOpenChange(false) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
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
