"use client"

import ReactSelect, {
  type ClassNamesConfig,
  type GroupBase,
  type Props,
  type MultiValueRemoveProps,
} from "react-select"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  label: string
  value: string
}

function classNames<
  Option = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(): ClassNamesConfig<Option, IsMulti, Group> {
  return {
    control: ({ isFocused, isDisabled }) =>
      cn(
        "!min-h-10 w-full rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs transition-[color,box-shadow]",
        isFocused && "border-ring ring-3 ring-ring/50",
        isDisabled && "cursor-not-allowed opacity-50",
        "dark:bg-input/30",
      ),
    valueContainer: () => "gap-1 p-0",
    input: () => "m-0 p-0 text-sm text-foreground",
    placeholder: () => "text-muted-foreground text-sm",
    singleValue: () => "text-sm text-foreground",
    multiValue: () =>
      "inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground",
    multiValueLabel: () => "text-xs leading-none",
    multiValueRemove: () =>
      "rounded-sm opacity-70 hover:opacity-100 hover:bg-accent cursor-pointer transition-opacity",
    indicatorsContainer: () => "gap-0.5",
    clearIndicator: () =>
      "rounded-sm p-0.5 opacity-50 hover:opacity-100 cursor-pointer transition-opacity",
    indicatorSeparator: () => "hidden",
    dropdownIndicator: ({ isFocused }) =>
      cn(
        "p-0.5 text-muted-foreground transition-colors",
        isFocused && "text-foreground",
      ),
    menu: () =>
      "mt-1 rounded-md border border-input bg-popover text-popover-foreground shadow-md overflow-hidden z-50",
    menuList: () => "p-1",
    option: ({ isFocused, isSelected, isDisabled }) =>
      cn(
        "relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
        isFocused && "bg-accent text-accent-foreground",
        isSelected && !isFocused && "bg-accent/50",
        isDisabled && "pointer-events-none opacity-50",
      ),
    noOptionsMessage: () => "py-4 text-center text-sm text-muted-foreground",
    loadingMessage: () => "py-4 text-center text-sm text-muted-foreground",
    groupHeading: () =>
      "px-2 py-1.5 text-xs font-medium text-muted-foreground",
  }
}

function MultiValueRemove<Option>(props: MultiValueRemoveProps<Option>) {
  return (
    <div {...props.innerProps}>
      <X className="h-3 w-3" />
    </div>
  )
}

type ReactSelectProps<
  Option = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = Omit<Props<Option, IsMulti, Group>, "classNames" | "unstyled" | "components"> & {
  className?: string
}

function ReactSelectSingle<
  Option = SelectOption,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: ReactSelectProps<Option, false, Group>) {
  return (
    <ReactSelect<Option, false, Group>
      unstyled
      classNames={classNames<Option, false, Group>()}
      components={{ MultiValueRemove }}
      {...props}
    />
  )
}

function ReactSelectMulti<
  Option = SelectOption,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: ReactSelectProps<Option, true, Group>) {
  return (
    <ReactSelect<Option, true, Group>
      unstyled
      isMulti
      classNames={classNames<Option, true, Group>()}
      components={{ MultiValueRemove }}
      closeMenuOnSelect={false}
      {...props}
    />
  )
}

export { ReactSelectSingle, ReactSelectMulti }
