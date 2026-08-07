"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReactSelectSingle } from "@/components/ui/react-select"
import { useCreateRole } from "@/hooks/use-rbac"
import { createRoleSchema, CreateRoleFormValues } from "@/lib/validations/rbac"

const ORG_TYPE_OPTIONS = [
  { label: "Jetrique", value: "JETRIQUE" },
  { label: "Operator", value: "OPERATOR" },
  { label: "Airline", value: "AIRLINE" },
]

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export function CreateRoleDialog() {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useCreateRole()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { isSystem: true },
  })

  const isSystem = watch("isSystem")

  async function onSubmit(values: CreateRoleFormValues) {
    const payload = {
      name: values.name,
      slug: values.slug,
      organizationType: values.organizationType,
      isSystem: values.isSystem,
      ...(!values.isSystem && { organizationId: values.organizationId }),
    }
    toast.promise(mutateAsync(payload), {
      loading: "Please wait...",
      success: () => {
        setOpen(false)
        reset()
        return "Role created"
      },
      error: "Failed to create role",
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset() }}>
      <DialogTrigger asChild>
        <Button>Create Role</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Name</Label>
            <Input
              placeholder="e.g. Operations Manager"
              {...register("name", {
                onChange: (e) => setValue("slug", toSlug(e.target.value)),
              })}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Slug</Label>
            <Input placeholder="e.g. operations-manager" {...register("slug")} />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Organization Type</Label>
            <ReactSelectSingle
              options={ORG_TYPE_OPTIONS}
              onChange={(opt) => setValue("organizationType", opt?.value ?? "")}
              placeholder="Select type"
            />
            {errors.organizationType && (
              <p className="text-xs text-destructive">{errors.organizationType.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <Label className="text-xs">System Role</Label>
            <Switch
              checked={isSystem}
              onCheckedChange={(v) => {
                setValue("isSystem", v)
                if (v) setValue("organizationId", undefined)
              }}
            />
          </div>

          {!isSystem && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Organization ID</Label>
              <Input placeholder="e.g. 39114e8a-fef1-4219-..." {...register("organizationId")} />
              {errors.organizationId && (
                <p className="text-xs text-destructive">{errors.organizationId.message}</p>
              )}
            </div>
          )}

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
