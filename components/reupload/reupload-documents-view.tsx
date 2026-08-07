"use client"

import { useRef, useState } from "react"
import { FileText, ExternalLink, CheckCircle2, XCircle, Clock, Upload, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/ui/status-badge"
import { useAuthStore } from "@/stores"
import { useMyOrgDocuments, useReuploadOrgDocument } from "@/hooks/use-organizations"
import { useLogout } from "@/hooks/use-auth"
import { DOCUMENT_TYPES } from "@/lib/constants"
import type { OrganizationDocument } from "@/types/organizations"

const DOCUMENT_LABELS = Object.fromEntries(DOCUMENT_TYPES.map((d) => [d.value, d.label]))

function DocumentCard({
  doc,
  orgId,
}: {
  doc: OrganizationDocument
  orgId: string
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutate: reupload, isPending } = useReuploadOrgDocument(orgId)

  const statusBg = {
    VERIFIED: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/40",
    REJECTED: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40",
    PENDING: "border-border bg-card",
  }[doc.status]

  const statusIcon = {
    VERIFIED: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    REJECTED: <XCircle className="h-4 w-4 text-red-500" />,
    PENDING: <Clock className="h-4 w-4 text-yellow-500" />,
  }[doc.status]

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    reupload({ docId: doc.id, file })
    e.target.value = ""
  }

  return (
    <div className={`flex flex-col gap-2.5 rounded-lg border p-4 ${statusBg}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium">
            {DOCUMENT_LABELS[doc.documentType] ?? doc.documentType}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {statusIcon}
          <StatusBadge status={doc.status} />
        </div>
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
          <span className="font-medium text-red-600 dark:text-red-400">Reason: </span>
          {doc.remarks}
        </p>
      )}

      {doc.status === "REJECTED" && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <Button
            size="sm"
            className="h-8 w-full gap-1.5"
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" />
            {isPending ? "Uploading…" : "Re-upload Document"}
          </Button>
        </>
      )}
    </div>
  )
}

export function ReuploadDocumentsView() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const orgId = user?.organization?.id ?? ""

  const { data: documents = [], isLoading } = useMyOrgDocuments()

  const rejectedCount = documents.filter((d) => d.status === "REJECTED").length
  const pendingCount = documents.filter((d) => d.status === "PENDING").length
  const verifiedCount = documents.filter((d) => d.status === "VERIFIED").length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{user?.organization?.name}</h1>
            <p className="text-sm text-muted-foreground">
              Your application was rejected. Please re-upload the required documents.
            </p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Status banner */}
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/40">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            Application Rejected
          </p>
          <p className="mt-0.5 text-xs text-red-600/80 dark:text-red-500">
            Review the rejection reasons below, re-upload the required documents, and your application will be reviewed again.
          </p>
        </div>

        {/* Document count summary */}
        {!isLoading && documents.length > 0 && (
          <div className="mb-5 flex items-center gap-4 text-sm">
            {rejectedCount > 0 && (
              <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <XCircle className="h-4 w-4" /> {rejectedCount} rejected
              </span>
            )}
            {pendingCount > 0 && (
              <span className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400">
                <Clock className="h-4 w-4" /> {pendingCount} pending
              </span>
            )}
            {verifiedCount > 0 && (
              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" /> {verifiedCount} verified
              </span>
            )}
          </div>
        )}

        {/* Documents grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-lg" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} orgId={orgId} />
            ))}
          </div>
        )}

        {/* After reupload message */}
        {!isLoading && rejectedCount === 0 && documents.length > 0 && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950/40">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              All documents submitted
            </p>
            <p className="mt-0.5 text-xs text-green-600/80 dark:text-green-500">
              Your documents are under review. You will be notified once your application is approved.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
