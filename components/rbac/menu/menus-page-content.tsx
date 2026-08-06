"use client"

import { Can } from "@/components/common"
import { CreateMenuDialog } from "./create-menu-dialog"
import { MenusTable } from "./menus-table"

export function MenusPageContent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Menus</h1>
          <p className="text-sm text-muted-foreground">Manage navigation menus and their hierarchy.</p>
        </div>
        <Can menu="menus" permission="create">
          <CreateMenuDialog />
        </Can>
      </div>

      <MenusTable />
    </div>
  )
}
