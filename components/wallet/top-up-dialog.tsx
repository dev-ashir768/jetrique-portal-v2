"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Upload, FileText, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useTopUp } from "@/hooks/use-wallet"
import { topUpSchema, type TopUpFormValues } from "@/lib/validations/wallet"

export function TopUpDialog() {
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync, isPending } = useTopUp()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TopUpFormValues>({
    resolver: zodResolver(topUpSchema),
  })

  const proofFile = watch("proof")

  async function onSubmit(values: TopUpFormValues) {
    await mutateAsync(values)
    setOpen(false)
    reset()
  }

  function handleClose() {
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); else setOpen(true) }}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Top Up
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Top Up Wallet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Amount <span className="text-destructive">*</span></Label>
            <Input
              type="number"
              min={1}
              placeholder="e.g. 10000"
              {...register("amount", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          {/* Reference */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Reference <span className="text-muted-foreground">(optional)</span></Label>
            <Input placeholder="e.g. TXN-ABC-123" {...register("reference")} />
          </div>

          {/* Remarks */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Remarks <span className="text-muted-foreground">(optional)</span></Label>
            <Input placeholder="e.g. Monthly top-up" {...register("remarks")} />
          </div>

          {/* Proof */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Payment Proof <span className="text-destructive">*</span></Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setValue("proof", file, { shouldValidate: true })
              }}
            />
            {proofFile ? (
              <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{proofFile.name}</span>
                <button
                  type="button"
                  onClick={() => { setValue("proof", undefined as unknown as File); if (fileInputRef.current) fileInputRef.current.value = "" }}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Upload className="h-4 w-4" />
                Click to upload screenshot or PDF
              </button>
            )}
            {errors.proof && <p className="text-xs text-destructive">{errors.proof.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting…" : "Submit Top Up"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
