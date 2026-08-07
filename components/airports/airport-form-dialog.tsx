"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ReactSelectSingle, type SelectOption } from "@/components/ui/react-select"
import { useCountries, useProvinces, useCities, useAirportLocations } from "@/hooks/use-locations"
import { useAirport, useCreateAirport, useUpdateAirport } from "@/hooks/use-airports"
import { airportSchema, type AirportFormValues } from "@/lib/validations/airport"
import type { Airport } from "@/types/airports"
import type { Location } from "@/types"

function toOptions(list: Location[]): SelectOption[] {
  return list.map((l) => ({ label: l.name, value: l.id }))
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  airport?: Airport | null
}

export function AirportFormDialog({ open, onOpenChange, airport }: Props) {
  const isEdit = !!airport

  const [countryId, setCountryId] = useState<string | null>(null)
  const [provinceId, setProvinceId] = useState<string | null>(null)
  const [cityId, setCityId] = useState<string | null>(null)

  // Fetch full detail (with nested parent chain) when editing
  const { data: airportDetail, isLoading: loadingDetail } = useAirport(airport?.id ?? "")

  const { data: countries = [], isLoading: loadingCountries } = useCountries()
  const { data: provinces = [], isLoading: loadingProvinces } = useProvinces(countryId)
  const { data: cities = [], isLoading: loadingCities } = useCities(provinceId)
  const { data: airportLocations = [], isLoading: loadingAirportLocs } = useAirportLocations(cityId)

  const { mutateAsync: create, isPending: creating } = useCreateAirport()
  const { mutateAsync: update, isPending: updating } = useUpdateAirport(airport?.id ?? "")
  const isPending = creating || updating
  const formLoading = isEdit && loadingDetail

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AirportFormValues>({
    resolver: zodResolver(airportSchema),
    defaultValues: {
      locationId: "",
      name: "",
      iataCode: "",
      terminal: "",
      handlingFees: undefined,
      timezone: "",
      _countryId: "",
      _provinceId: "",
      _cityId: "",
    },
  })

  const locationId = watch("locationId")

  // Populate form when editing — wait for full detail with parent chain
  useEffect(() => {
    if (!open) return
    if (isEdit && airportDetail) {
      setValue("locationId", airportDetail.locationId)
      setValue("name", airportDetail.name)
      setValue("iataCode", airportDetail.iataCode)
      setValue("terminal", airportDetail.terminal ?? "")
      setValue("handlingFees", airportDetail.handlingFees ? Number(airportDetail.handlingFees) : undefined)
      setValue("timezone", airportDetail.timezone ?? "")

      // Traverse nested parent chain: AIRPORT → CITY → PROVINCE → COUNTRY
      const city = airportDetail.location?.parent ?? null
      const province = city?.parent ?? null
      const country = province?.parent ?? null

      setCountryId(country?.id ?? null)
      setProvinceId(province?.id ?? null)
      setCityId(city?.id ?? null)
    } else if (!isEdit) {
      reset()
      setCountryId(null)
      setProvinceId(null)
      setCityId(null)
    }
  }, [open, isEdit, airportDetail, setValue, reset])

  async function onSubmit(values: AirportFormValues) {
    const payload = {
      locationId: values.locationId,
      name: values.name,
      iataCode: values.iataCode,
      ...(values.terminal ? { terminal: values.terminal } : {}),
      ...(values.handlingFees !== undefined ? { handlingFees: values.handlingFees } : {}),
      ...(values.timezone ? { timezone: values.timezone } : {}),
    }

    if (isEdit) {
      await update(payload)
    } else {
      await create(payload as Parameters<typeof create>[0])
    }
    onOpenChange(false)
    reset()
  }

  function handleClose() {
    onOpenChange(false)
    reset()
    setCountryId(null)
    setProvinceId(null)
    setCityId(null)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); else onOpenChange(true) }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Airport" : "Add Airport"}</DialogTitle>
        </DialogHeader>

        {formLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : null}
        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-4${formLoading ? " hidden" : ""}`}>
          {/* Location cascade */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Country</Label>
              <ReactSelectSingle<SelectOption>
                options={toOptions(countries)}
                isLoading={loadingCountries}
                placeholder="Select country"
                value={toOptions(countries).find((o) => o.value === countryId) ?? null}
                onChange={(opt) => {
                  setCountryId(opt?.value ?? null)
                  setProvinceId(null)
                  setCityId(null)
                  setValue("_countryId", opt?.value ?? "")
                  setValue("_provinceId", "")
                  setValue("_cityId", "")
                  setValue("locationId", "")
                }}
                isClearable
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Province</Label>
              <ReactSelectSingle<SelectOption>
                options={toOptions(provinces)}
                isLoading={loadingProvinces}
                placeholder={!countryId ? "Select country first" : "Select province"}
                isDisabled={!countryId}
                value={toOptions(provinces).find((o) => o.value === provinceId) ?? null}
                onChange={(opt) => {
                  setProvinceId(opt?.value ?? null)
                  setCityId(null)
                  setValue("_provinceId", opt?.value ?? "")
                  setValue("_cityId", "")
                  setValue("locationId", "")
                }}
                isClearable
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">City</Label>
              <ReactSelectSingle<SelectOption>
                options={toOptions(cities)}
                isLoading={loadingCities}
                placeholder={!provinceId ? "Select province first" : "Select city"}
                isDisabled={!provinceId}
                value={toOptions(cities).find((o) => o.value === cityId) ?? null}
                onChange={(opt) => {
                  setCityId(opt?.value ?? null)
                  setValue("_cityId", opt?.value ?? "")
                  setValue("locationId", "")
                }}
                isClearable
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">
                Airport Location <span className="text-destructive">*</span>
              </Label>
              <ReactSelectSingle<SelectOption>
                options={toOptions(airportLocations)}
                isLoading={loadingAirportLocs}
                placeholder={!cityId ? "Select city first" : "Select airport location"}
                isDisabled={!cityId}
                value={toOptions(airportLocations).find((o) => o.value === locationId) ?? null}
                onChange={(opt) => setValue("locationId", opt?.value ?? "")}
                isClearable
              />
              {errors.locationId && (
                <p className="text-xs text-destructive">{errors.locationId.message}</p>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">
              Airport Name <span className="text-destructive">*</span>
            </Label>
            <Input placeholder="e.g. Jinnah International Airport" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* IATA + Terminal */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">
                IATA Code <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. KHI"
                maxLength={4}
                {...register("iataCode", {
                  onChange: (e) =>
                    setValue("iataCode", e.target.value.toUpperCase()),
                })}
              />
              {errors.iataCode && (
                <p className="text-xs text-destructive">{errors.iataCode.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Terminal</Label>
              <Input placeholder="e.g. Terminal 1" {...register("terminal")} />
            </div>
          </div>

          {/* Handling Fees + Timezone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Handling Fees</Label>
              <Input
                type="number"
                min={0}
                placeholder="e.g. 5000"
                {...register("handlingFees", {
                  setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
                })}
              />
              {errors.handlingFees && (
                <p className="text-xs text-destructive">{errors.handlingFees.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Timezone</Label>
              <Input placeholder="e.g. Asia/Karachi" {...register("timezone")} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (isEdit ? "Saving…" : "Creating…") : isEdit ? "Save Changes" : "Create Airport"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
