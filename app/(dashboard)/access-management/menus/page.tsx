import { MenusTable } from "./_components/menus-table"
import { CreateMenuDialog } from "./_components/create-menu-dialog"

export const metadata = {
  title: "Menus",
}

export default function MenusPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Menus</h1>
          <p className="text-sm text-muted-foreground">Manage navigation menus and their hierarchy.</p>
        </div>
        <CreateMenuDialog />
      </div>

      <MenusTable />
    </div>
  )
}
