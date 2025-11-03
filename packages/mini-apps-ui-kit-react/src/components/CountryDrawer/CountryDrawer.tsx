"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRef, useState } from "react";

import type { Direction } from "../../types/global";
import { Button } from "../Button";
import { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from "../Drawer";
import { CountryCode } from "../Flag";
import { XMark } from "../Icons/XMark";
import { GroupedCountryList } from "../PhoneField/GroupedCountryList";
import { SearchField } from "../SearchField";
import { TopBar } from "../TopBar";
import { useCountryFiltering } from "./useCountryFiltering";
import { useCountryGrouping } from "./useCountryGrouping";

interface CountryDrawerProps {
  /** Currently selected country code */
  value: CountryCode;
  /** Optional list of country codes to show. If not provided, shows all countries */
  countries?: CountryCode[];
  /** Whether the drawer trigger is disabled */
  disabled?: boolean;
  /** Default country code when no value is selected */
  defaultValue?: CountryCode;
  /** Content to render as the drawer trigger */
  children: React.ReactNode;
  /** Title text shown in the drawer header */
  title?: string;
  /** Label text shown in the search field */
  searchLabel?: string;
  /** The reading direction of the drawer. If omitted, assumes LTR (left-to-right) reading mode. */
  dir?: Direction;
  /** Optional BCP 47 locale to localize country names and search */
  locale?: string;
  /** Callback fired when a country is selected */
  onChange: (countryCode: string) => void;
  /** Optional callback fired when drawer open/close animation completes */
  onAnimationEnd?: (open: boolean) => void;
}

function CountryDrawer({
  onChange,
  value,
  countries,
  locale,
  onAnimationEnd,
  disabled = false,
  children,
  defaultValue = "US",
  title = "Country",
  searchLabel,
  dir,
}: CountryDrawerProps) {
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filteredCountries = useCountryFiltering({
    countries,
    searchText,
  });

  const groupedCountries = useCountryGrouping({
    countries: filteredCountries,
    defaultValue,
    locale,
  });

  const handleCountrySelect = (countryCode: CountryCode) => {
    onChange(countryCode);
    setSearchText("");
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} onAnimationEnd={onAnimationEnd} height="full">
      <DrawerTrigger asChild className="outline-none" disabled={disabled}>
        {children}
      </DrawerTrigger>

      <DrawerContent dir={dir}>
        <VisuallyHidden>
          <DrawerTitle>{title}</DrawerTitle>
        </VisuallyHidden>
        <TopBar
          title={title}
          startAdornment={
            <DrawerClose asChild>
              <Button variant="tertiary" size="icon">
                <XMark />
              </Button>
            </DrawerClose>
          }
        />

        <div className="p-6 shrink-0">
          <SearchField
            ref={searchRef}
            value={searchText}
            onChange={handleSearchChange}
            label={searchLabel}
          />
        </div>

        <div className="no-scrollbar w-full overflow-auto px-6 grow">
          <GroupedCountryList
            groupedCountries={groupedCountries}
            onSelect={handleCountrySelect}
            value={value}
            dir={dir}
            locale={locale}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export { CountryDrawer };
export type { CountryDrawerProps };
