"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  useOrganization,
  useOrganizationDocuments,
  useVerifyDocument,
  useRejectDocument,
  useApproveOrganization,
  useRejectOrganization,
  useSuspendOrganization,
} from "@/hooks/use-organizations"
import { usePermissions } from "@/hooks/use-permission"
import { DOCUMENT_TYPES } from "@/lib/constants"
import type { OrganizationDocument } from "@/types/organizations"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

const DOCUMENT_LABELS = Object.fromEntries(DOCUMENT_TYPES.map((d) => [d.value, d.label]))

// ─── Field Row ────────────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-start gap-4 py-2.5">
      <span className="w-32 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="flex-1 text-sm font-medium">{value ?? "—"}</span>
    </div>
  )
}

// ─── Document Card ────────────────────────────────────────────────────────────

function DocumentCard({
  doc,
  orgId,
  canReview,
}: {
  doc: OrganizationDocument
  orgId: string
  canReview: boolean
}) {
  const [rejectOpen, setRejectOpen] = useState(false)
  const [remarks, setRemarks] = useState("")

  const { mutate: verify, isPending: verifying } = useVerifyDocument(orgId)
  const { mutate: reject, isPending: rejecting } = useRejectDocument(orgId)

  const statusBg = {
    VERIFIED: "border-green-200 bg-green-50/60 dark:border-green-900 dark:bg-green-950/40",
    REJECTED: "border-red-200 bg-red-50/60 dark:border-red-900 dark:bg-red-950/40",
    PENDING: "border-border bg-card",
  }[doc.status]

  const statusIcon = {
    VERIFIED: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    REJECTED: <XCircle className="h-4 w-4 text-red-500" />,
    PENDING: <Clock className="h-4 w-4 text-yellow-500" />,
  }[doc.status]

  return (
    <>
      <div className={`flex flex-col gap-2.5 rounded-lg border p-3.5 ${statusBg}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm font-medium leading-tight truncate">
              {DOCUMENT_LABELS[doc.documentType] ?? doc.documentType}
            </span>
          </div>
          {statusIcon}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted-foreground">{doc.fileName}</span>
          <a
            href={doc.downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1 text-xs text-primary hover:underline"
          >
            View <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {doc.remarks && (
          <p className="rounded bg-background/70 px-2 py-1 text-xs text-muted-foreground">
            {doc.remarks}
          </p>
        )}

        {canReview && doc.status === "PENDING" && (
          <div className="flex gap-2 pt-0.5">
            <Button disabled={verifying} onClick={() => verify(doc.id)}>
              {verifying ? "Verifying…" : "Verify"}
            </Button>
            <Button
              variant="secondary" disabled={rejecting}
              onClick={() => setRejectOpen(true)}
            >
              Reject
            </Button>
          </div>
        )}
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            <Label>Reason <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="e.g. Blurry image, wrong document…"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter className="justify-center! gap-4!">
            <Button
              disabled={!remarks.trim() || rejecting}
              onClick={() =>
                reject(
                  { docId: doc.id, remarks },
                  { onSuccess: () => { setRejectOpen(false); setRemarks("") } },
                )
              }
            >
              {rejecting ? "Rejecting…" : "Reject"}
            </Button>
            <Button variant="secondary" onClick={() => setRejectOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function OrganizationDetail({ id }: { id: string }) {
  const router = useRouter()

  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [commissionRate, setCommissionRate] = useState("")
  const [remarks, setRemarks] = useState("")

  const { data: org, isLoading: orgLoading, refetch: refetchOrg } = useOrganization(id)
  const { data: documents = [], isLoading: docsLoading, refetch: refetchDocs } =
    useOrganizationDocuments(id)

  const menuSlug = org?.type === "AGENT" ? "agents" : "operators"
  const perms = usePermissions(menuSlug, ["approve", "reject", "suspend"])

  const { mutate: approve, isPending: approving } = useApproveOrganization()
  const { mutate: reject, isPending: rejecting } = useRejectOrganization()
  const { mutate: suspend, isPending: suspending } = useSuspendOrganization()

  const approvedCount = documents.filter((d: OrganizationDocument) => d.status === "VERIFIED").length
  const pendingCount = documents.filter((d: OrganizationDocument) => d.status === "PENDING").length
  const allDocsVerified = documents.length > 0 && documents.every((d: OrganizationDocument) => d.status === "VERIFIED")
  const canApprove = perms.approve && (org?.status === "PENDING" || org?.status === "REJECTED") && allDocsVerified

  if (orgLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-14 w-full rounded-lg" />
        <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-52 rounded-lg" />
            <Skeleton className="h-44 rounded-lg" />
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!org) return null

  const isAgent = org.type === "AGENT"

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header Bar ── */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-semibold">{org.name}</h1>
            <StatusBadge status={org.status} />
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {org.email}
            <span className="mx-1.5 opacity-40">·</span>
            <span className="font-mono opacity-60">ID: {org.id}</span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
              variant="secondary" size="icon" className="h-8 w-8"
                onClick={() => { void refetchOrg(); void refetchDocs() }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>

          {perms.reject && org.status === "PENDING" && (
            <Button
              variant="secondary"
              onClick={() => setRejectOpen(true)}
            >
              Reject
            </Button>
          )}

          {perms.suspend && org.status === "APPROVED" && (
            <Button
              variant="secondary"
              onClick={() => setSuspendOpen(true)}
            >
              Suspend
            </Button>
          )}

          {perms.approve && (org.status === "PENDING" || org.status === "REJECTED") && (
            <Button
              disabled={!canApprove || approving}
              title={!allDocsVerified ? "Verify all documents first" : undefined}
              onClick={() => setApproveOpen(true)}
            >
              {approving ? "Approving…" : "Approve"}
            </Button>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Profile */}
          <div className="rounded-lg border border-border bg-card px-5 py-4">
            <p className="mb-1 text-sm font-semibold">Profile</p>
            <div className="divide-y divide-border">
              <Field label="Name" value={org.name} />
              <Field label="Email" value={org.email} />
              <Field label="Phone" value={org.phone} />
              <Field label="Type" value={org.type} />
              {isAgent && org.agentProfile && (
                <Field label="Category" value={org.agentProfile.agentCategory} />
              )}
              <Field
                label="Joined"
                value={new Date(org.createdAt).toLocaleDateString("en-PK", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              />
            </div>
          </div>

          {/* Business Details */}
          <div className="rounded-lg border border-border bg-card px-5 py-4">
            <p className="mb-1 text-sm font-semibold">Business Details</p>
            <div className="divide-y divide-border">
              <Field label="Reg. No." value={org.registrationNumber} />
              <Field label="Address" value={org.address} />
              <Field label="City" value={org.city?.name ?? null} />
              {org.remarks && <Field label="Remarks" value={org.remarks} />}
            </div>
          </div>
        </div>

        {/* Right column — Documents */}
        <div className="rounded-lg border border-border bg-card px-5 py-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold">Documents</p>
            {documents.length > 0 && (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-green-600 dark:text-green-400">{approvedCount} approved</span>
                <span className="text-muted-foreground">{pendingCount} pending</span>
              </div>
            )}
          </div>

          {perms.approve && (org.status === "PENDING" || org.status === "REJECTED") && !allDocsVerified && (
            <div className="mb-4 flex items-center gap-1.5 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-400">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              Approve button will be enabled once all documents are verified.
            </div>
          )}

          {docsLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <FileText className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {documents.map((doc: OrganizationDocument) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  orgId={id}
                  canReview={perms.approve || perms.reject}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Approve Dialog ── */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Organization</DialogTitle>
          </DialogHeader>
          {isAgent && (
            <div className="flex flex-col gap-1.5">
              <Label>Commission Rate (%) <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="e.g. 15"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
              />
            </div>
          )}
          <DialogFooter className="flex justify-center! gap-4!">
            <Button
              disabled={approving || (isAgent && !commissionRate)}
              onClick={() =>
                approve(
                  { id, commissionRate: isAgent ? Number(commissionRate) : undefined },
                  { onSuccess: () => setApproveOpen(false) },
                )
              }
            >
              {approving ? "Approving…" : "Approve"}
            </Button>
            <Button variant="secondary" onClick={() => setApproveOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject Dialog ── */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Organization</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            <Label>Reason <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="Provide a reason…"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter className="flex justify-center! gap-4!">
            <Button
              disabled={!remarks.trim() || rejecting}
              onClick={() =>
                reject(
                  { id, remarks },
                  { onSuccess: () => { setRejectOpen(false); setRemarks("") } },
                )
              }
            >
              {rejecting ? "Rejecting…" : "Reject"}
            </Button>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Suspend Dialog ── */}
      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Suspend Organization</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            <Label>Reason <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="e.g. Policy violation…"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter className="flex justify-center! gap-4!">
            <Button
              disabled={!remarks.trim() || suspending}
              onClick={() =>
                suspend(
                  { id, remarks },
                  { onSuccess: () => { setSuspendOpen(false); setRemarks("") } },
                )
              }
            >
              {suspending ? "Suspending…" : "Suspend"}
            </Button>
            <Button variant="secondary" onClick={() => setSuspendOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
