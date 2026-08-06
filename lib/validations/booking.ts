import { z } from "zod"

const passengerSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  documentType: z.string().trim().optional(),
  documentNumber: z.string().trim().optional(),
})

export const bookingSchema = z.object({
  aircraftId: z.string().min(1, "Select an aircraft"),
  departureLocationId: z.string().min(1, "Select departure location"),
  arrivalLocationId: z.string().min(1, "Select arrival location"),
  departureDate: z.string().min(1, "Select departure date"),
  departureTime: z.string().min(1, "Select departure time"),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  isRoundTrip: z.boolean(),
  passengers: z.array(passengerSchema).min(1, "At least one passenger is required"),
  specialRequests: z.string().trim().optional(),
  paymentMethod: z.enum(["wallet", "card", "bank_transfer"]),
})

export type BookingFormValues = z.infer<typeof bookingSchema>
export type PassengerFormValues = z.infer<typeof passengerSchema>
