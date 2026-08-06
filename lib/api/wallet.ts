import { apiClient } from "./client"
import type { PaginationParams } from "@/types"

export const walletApi = {
  getMyWallet: () =>
    apiClient.get("/wallet"),
}
