import { z } from "zod"

export const airportSchema = z.object({
  locationId: z.string().min(1, "Airport location is required"),
  name: z.string().trim().min(1, "Name is required"),
  iataCode: z
    .string()
    .trim()
    .min(3, "IATA code must be 3–4 characters")
    .max(4, "IATA code must be 3–4 characters")
    .regex(/^[A-Z]+$/, "IATA code must be uppercase letters only"),
  terminal: z.string().trim().optional().or(z.literal("")),
  handlingFees: z.number().positive("Must be positive").optional().or(z.literal("")),
  timezone: z.string().trim().optional().or(z.literal("")),
  // location cascade (not sent to API, only for UI state)
  _countryId: z.string().optional(),
  _provinceId: z.string().optional(),
  _cityId: z.string().optional(),
})

export type AirportFormValues = z.infer<typeof airportSchema>
