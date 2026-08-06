---
name: rbac-permission-system
description: RBAC permission system — route-level protection via AuthGuard + UI-level via Can component and usePermission hook
metadata:
  type: project
---

Each menu from `/rbac/me/menus` has a `permissions[]` array (e.g. `read`, `create`, `update`, `delete`). Backend only returns menus the user has access to.

**Route-level protection**: `AuthGuard` checks if current pathname matches any menu path the user has. If not, redirects to `/dashboard`. `/dashboard` is always allowed (PUBLIC_ROUTES).

**UI-level protection**: Use `<Can menu="slug" permission="slug">` component or `usePermission("menuSlug", "permissionSlug")` hook to show/hide buttons, columns, actions.

**Why:** Users can type URLs directly or share links. Without route-level checks, unauthorized users could access pages. Without UI-level checks, they'd see buttons they can't use.

**How to apply:**
- Every page under `(dashboard)` is protected by `AuthGuard` (route + auth)
- Wrap action buttons (Create, Delete, Edit) with `<Can>` component
- Use `usePermission` hook when conditional logic is needed beyond show/hide
- `usePermissions("menu", ["create","update","delete"])` for multiple checks at once
- Related: [[project-patterns]], [[feedback-ui-consistency]]

**Key files:**
- `components/common/auth-guard.tsx` — route protection
- `components/common/can.tsx` — declarative UI permission wrapper
- `hooks/use-permission.ts` — `usePermission` and `usePermissions` hooks
- `stores/rbac-store.ts` — `hasPermission(menuSlug, permissionSlug)` method
