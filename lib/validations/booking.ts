import { z } from "zod"

const passengerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  documentType: z.string().optional(),
  documentNumber: z.string().optional(),
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
  specialRequests: z.string().optional(),
  paymentMethod: z.enum(["wallet", "card", "bank_transfer"]),
})

export type BookingFormValues = z.infer<typeof bookingSchema>
export type PassengerFormValues = z.infer<typeof passengerSchema>
