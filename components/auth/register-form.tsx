"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { makeRegisterSchema, type RegisterFormValues } from "@/lib/validations/auth"
import { Plane, Briefcase, MapPin, Globe, Building2, Eye, EyeOff, Upload, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReactSelectSingle, type SelectOption } from "@/components/ui/react-select"
import { useRegister } from "@/hooks/use-auth"
import { useCountries, useProvinces, useCities } from "@/hooks/use-locations"
import type { AgentCategory, Location } from "@/types"
import {
  DOCUMENT_TYPES,
  AGENT_CATEGORIES,
  DOCUMENT_FIELD_MAP,
  REQUIRED_DOCUMENTS_BY_CATEGORY,
  REQUIRED_OPERATOR_DOCUMENTS,
} from "@/lib/constants"

const DOCUMENT_LABELS = Object.fromEntries(DOCUMENT_TYPES.map((d) => [d.value, d.label]))

const STEP1_FIELDS = [
  "organizationName",
  "organizationEmail",
  "organizationPhone",
  "countryId",
  "provinceId",
  "cityId",
  "registrationNumber",
  "address",
] as const

const STEP2_FIELDS = ["adminName", "adminEmail", "adminPassword"] as const



// ─── Document Upload ───────────────────────────────────────────────────────

interface DocumentUploadProps {
  docKey: string
  required: boolean
  value: File | null
  onChange: (file: File | null) => void
}

function DocumentUpload({ docKey, required, value, onChange }: DocumentUploadProps) {
  const label = DOCUMENT_LABELS[docKey] ?? docKey

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error(`${label}: File size must be under 5MB`)
      e.target.value = ""
      return
    }
    onChange(file)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium">
        {label}
        {required
          ? <span className="ml-1 text-destructive">*</span>
          : <span className="ml-1 text-xs text-muted-foreground">(optional)</span>}
      </Label>
      {value ? (
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
          <span className="flex-1 truncate text-sm">{value.name}</span>
          <span className="shrink-0 text-xs text-muted-foreground">{(value.size / 1024).toFixed(0)} KB</span>
          <button type="button" onClick={() => onChange(null)} className="shrink-0 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-4 py-4 text-center transition-colors hover:bg-muted/60">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Click to upload · JPG, PNG, PDF · max 5MB</span>
          <input type="file" className="sr-only" accept="image/jpeg,image/jpg,image/png,application/pdf" onChange={handleChange} />
        </label>
      )}
    </div>
  )
}

// ─── Main Form ─────────────────────────────────────────────────────────────

export function RegisterForm() {
  const [orgType, setOrgType] = useState<"OPERATOR" | "AGENT" | null>(null)
  const [agentCategory, setAgentCategory] = useState<AgentCategory | null>(null)
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0)
  const [showPassword, setShowPassword] = useState(false)
  const [documents, setDocuments] = useState<Record<string, File | null>>({})

  const [countryCode, setCountryCode] = useState<string | null>(null)
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null)
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null)

  const { mutateAsync, isPending } = useRegister()

  const { data: countries = [], isLoading: countriesLoading } = useCountries()
  const { data: provinces = [], isLoading: provincesLoading } = useProvinces(selectedCountryId)
  const { data: cities = [], isLoading: citiesLoading } = useCities(selectedProvinceId)

  const {
    register,
    trigger,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(makeRegisterSchema(countryCode)),
    defaultValues: { countryId: "", provinceId: "", cityId: "" },
  })

  function onCountryChange(countryId: string) {
    const loc: Location | undefined = countries.find((c: Location) => c.id === countryId)
    setSelectedCountryId(countryId)
    setCountryCode(loc?.code ?? null)
    setSelectedProvinceId(null)
    setValue("countryId", countryId)
    setValue("provinceId", "")
    setValue("cityId", "")
  }

  function onProvinceChange(provinceId: string) {
    setSelectedProvinceId(provinceId)
    setValue("provinceId", provinceId)
    setValue("cityId", "")
  }

  function getRequiredDocs(): string[] {
    if (orgType === "OPERATOR") return REQUIRED_OPERATOR_DOCUMENTS
    if (orgType === "AGENT" && agentCategory) return REQUIRED_DOCUMENTS_BY_CATEGORY[agentCategory] ?? []
    return []
  }

  async function handleStep1Next() {
    const valid = await trigger([...STEP1_FIELDS])
    if (valid) setStep(2)
  }

  async function handleStep2Next() {
    const valid = await trigger([...STEP2_FIELDS])
    if (valid) setStep(3)
  }

  async function handleSubmit() {
    if (!orgType) return

    const requiredDocs = getRequiredDocs()
    const missingDocs = requiredDocs.filter((d) => !documents[d])
    if (missingDocs.length > 0) {
      toast.error(`Please upload: ${missingDocs.map((d) => DOCUMENT_LABELS[d]).join(", ")}`)
      return
    }

    const values = getValues()
    const formData = new FormData()

    formData.append("organizationName", values.organizationName)
    formData.append("organizationType", orgType)
    formData.append("organizationEmail", values.organizationEmail)
    formData.append("organizationPhone", values.organizationPhone)
    formData.append("organizationPhoneCountry", countryCode ?? "")
    formData.append("registrationNumber", values.registrationNumber)
    formData.append("address", values.address)
    formData.append("cityId", values.cityId)
    if (orgType === "AGENT" && agentCategory) formData.append("agentCategory", agentCategory)
    formData.append("adminName", values.adminName)
    formData.append("adminEmail", values.adminEmail)
    formData.append("adminPassword", values.adminPassword)

    Object.entries(documents).forEach(([docKey, file]) => {
      if (file) {
        const fieldName = DOCUMENT_FIELD_MAP[docKey]
        if (fieldName) formData.append(fieldName, file)
      }
    })

    toast.promise(mutateAsync(formData), {
      loading: "Please wait…",
      success: "Registration submitted!",
      error: (err: unknown) => {
        const e = err as { response?: { data?: { message?: string } } }
        return e?.response?.data?.message ?? "Registration failed. Please try again."
      },
    })
  }

  const docKeys = orgType === "OPERATOR"
    ? REQUIRED_OPERATOR_DOCUMENTS
    : orgType === "AGENT" && agentCategory
      ? REQUIRED_DOCUMENTS_BY_CATEGORY[agentCategory] ?? []
      : []

  const requiredDocs = getRequiredDocs()

  return (
    <div className="flex flex-col gap-6">

      {/* Step 0 — Type & Category */}
      {step === 0 && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3">
            {(["OPERATOR", "AGENT"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => { setOrgType(type); if (type === "OPERATOR") setAgentCategory(null) }}
                className={`flex flex-col items-start gap-2 rounded-md border-2 p-4 text-left transition-colors ${
                  orgType === type ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {type === "OPERATOR"
                  ? <Plane className={`h-6 w-6 ${orgType === "OPERATOR" ? "text-primary" : "text-muted-foreground"}`} />
                  : <Briefcase className={`h-6 w-6 ${orgType === "AGENT" ? "text-primary" : "text-muted-foreground"}`} />}
                <div>
                  <div className="text-sm font-semibold text-card-foreground">{type === "OPERATOR" ? "Operator" : "Agent"}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {type === "OPERATOR" ? "Aviation operator providing flights" : "Travel agent or booking partner"}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {orgType === "AGENT" && (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-card-foreground">Select your category</Label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: "TOUR_OPERATOR" as AgentCategory, Icon: MapPin },
                  { value: "TRAVEL_AGENT" as AgentCategory, Icon: Globe },
                  { value: "HOTEL_PARTNER" as AgentCategory, Icon: Building2 },
                ] as const).map(({ value, Icon }) => {
                  const cat = AGENT_CATEGORIES.find((c) => c.value === value)!
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAgentCategory(value)}
                      className={`flex flex-col items-start gap-2 rounded-md border-2 p-3 text-left transition-colors ${
                        agentCategory === value ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${agentCategory === value ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="text-sm font-semibold text-card-foreground">{cat.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <Button
            className="h-10 w-full"
            disabled={!orgType || (orgType === "AGENT" && !agentCategory)}
            onClick={() => setStep(1)}
          >
            Continue
          </Button>
        </div>
      )}

      {/* Steps 1–3 */}
      {step >= 1 && step <= 3 && (
        <div className="flex flex-col gap-5">
          {/* Selection summary */}
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
            {orgType === "OPERATOR"
              ? <Plane className="h-4 w-4 shrink-0 text-primary" />
              : <Briefcase className="h-4 w-4 shrink-0 text-primary" />}
            <span className="text-sm font-medium text-foreground">
              {orgType === "OPERATOR" ? "Operator" : "Agent"}
            </span>
            {orgType === "AGENT" && agentCategory && (
              <>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm text-muted-foreground">
                  {AGENT_CATEGORIES.find((c) => c.value === agentCategory)?.label}
                </span>
              </>
            )}
            <button
              type="button"
              onClick={() => setStep(0)}
              className="ml-auto text-xs text-primary underline-offset-2 hover:underline"
            >
              Change
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                  step > s ? "border-primary bg-primary text-primary-foreground"
                  : step === s ? "border-primary bg-background text-primary"
                  : "border-muted-foreground/30 bg-background text-muted-foreground/50"
                }`}>
                  {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                </div>
                {s < 3 && <div className={`h-0.5 flex-1 rounded-full transition-colors ${step > s ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1 — Organization Details */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-muted-foreground">Step 1 of 3 — Organization Details</p>
              <div className="grid grid-cols-2 gap-3">

                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="organizationName">Organization Name <span className="text-destructive">*</span></Label>
                  <Input id="organizationName" placeholder="Acme Aviation Ltd." {...register("organizationName")} />
                  {errors.organizationName && <p className="text-xs text-destructive">{errors.organizationName.message}</p>}
                </div>

                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="organizationEmail">Organization Email <span className="text-destructive">*</span></Label>
                  <Input id="organizationEmail" type="email" placeholder="org@example.com" {...register("organizationEmail")} />
                  {errors.organizationEmail && <p className="text-xs text-destructive">{errors.organizationEmail.message}</p>}
                </div>

                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label>Country <span className="text-destructive">*</span></Label>
                  <Controller
                    control={control}
                    name="countryId"
                    render={({ field }) => (
                      <ReactSelectSingle<SelectOption>
                        placeholder={countriesLoading ? "Loading…" : "Select country"}
                        options={countries.map((c) => ({ label: c.name, value: c.id }))}
                        value={countries.map((c) => ({ label: c.name, value: c.id })).find((o) => o.value === field.value) ?? null}
                        onChange={(opt) => { const v = opt?.value ?? ""; field.onChange(v); onCountryChange(v) }}
                        isLoading={countriesLoading}
                        isClearable
                      />
                    )}
                  />
                  {errors.countryId && <p className="text-xs text-destructive">{errors.countryId.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Province <span className="text-destructive">*</span></Label>
                  <Controller
                    control={control}
                    name="provinceId"
                    render={({ field }) => (
                      <ReactSelectSingle<SelectOption>
                        placeholder={!selectedCountryId ? "Select country first" : provincesLoading ? "Loading…" : "Select province"}
                        options={provinces.map((p) => ({ label: p.name, value: p.id }))}
                        value={provinces.map((p) => ({ label: p.name, value: p.id })).find((o) => o.value === field.value) ?? null}
                        onChange={(opt) => { const v = opt?.value ?? ""; field.onChange(v); onProvinceChange(v) }}
                        isDisabled={!selectedCountryId}
                        isLoading={provincesLoading}
                        isClearable
                      />
                    )}
                  />
                  {errors.provinceId && <p className="text-xs text-destructive">{errors.provinceId.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>City <span className="text-destructive">*</span></Label>
                  <Controller
                    control={control}
                    name="cityId"
                    render={({ field }) => (
                      <ReactSelectSingle<SelectOption>
                        placeholder={!selectedProvinceId ? "Select province first" : citiesLoading ? "Loading…" : "Select city"}
                        options={cities.map((c) => ({ label: c.name, value: c.id }))}
                        value={cities.map((c) => ({ label: c.name, value: c.id })).find((o) => o.value === field.value) ?? null}
                        onChange={(opt) => field.onChange(opt?.value ?? "")}
                        isDisabled={!selectedProvinceId}
                        isLoading={citiesLoading}
                        isClearable
                      />
                    )}
                  />
                  {errors.cityId && <p className="text-xs text-destructive">{errors.cityId.message}</p>}
                </div>

                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="organizationPhone">
                    Phone <span className="text-destructive">*</span>
                    {countryCode && (
                      <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground">{countryCode}</span>
                    )}
                  </Label>
                  <Input
                    id="organizationPhone"
                    placeholder={countryCode === "PK" ? "+92 300 0000000" : "+1 555 000 0000"}
                    {...register("organizationPhone")}
                  />
                  {errors.organizationPhone && <p className="text-xs text-destructive">{errors.organizationPhone.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="registrationNumber">Registration No. <span className="text-destructive">*</span></Label>
                  <Input id="registrationNumber" placeholder="REG-12345" {...register("registrationNumber")} />
                  {errors.registrationNumber && <p className="text-xs text-destructive">{errors.registrationNumber.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
                  <Input id="address" placeholder="123 Main Street, Karachi" {...register("address")} />
                  {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
                </div>

              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="h-10 flex-1" onClick={() => setStep(0)}>Back</Button>
                <Button type="button" className="h-10 flex-1" onClick={handleStep1Next}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 2 — Admin Account */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-muted-foreground">Step 2 of 3 — Admin Account</p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="adminName">Admin Name <span className="text-destructive">*</span></Label>
                  <Input id="adminName" placeholder="John Doe" {...register("adminName")} />
                  {errors.adminName && <p className="text-xs text-destructive">{errors.adminName.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="adminEmail">Admin Email <span className="text-destructive">*</span></Label>
                  <Input id="adminEmail" type="email" placeholder="admin@example.com" {...register("adminEmail")} />
                  {errors.adminEmail && <p className="text-xs text-destructive">{errors.adminEmail.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="adminPassword">Password <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input
                      id="adminPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className="pr-9"
                      {...register("adminPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.adminPassword && <p className="text-xs text-destructive">{errors.adminPassword.message}</p>}
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="h-10 flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button type="button" className="h-10 flex-1" onClick={handleStep2Next}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 3 — Documents */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-muted-foreground">Step 3 of 3 — Documents</p>
              {docKeys.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents required for this category.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {docKeys.map((docKey) => (
                    <DocumentUpload
                      key={docKey}
                      docKey={docKey}
                      required={requiredDocs.includes(docKey)}
                      value={documents[docKey] ?? null}
                      onChange={(file) => setDocuments((prev) => ({ ...prev, [docKey]: file }))}
                    />
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="h-10 flex-1" onClick={() => setStep(2)}>Back</Button>
                <Button type="button" className="h-10 flex-1" disabled={isPending} onClick={handleSubmit}>
                  {isPending ? "Submitting…" : "Submit"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
