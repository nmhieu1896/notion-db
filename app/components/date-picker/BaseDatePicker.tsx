import clsx from "clsx";
import { useEffect, useState } from "react";
import { DateValue } from "react-aria";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker,
  DatePickerProps,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Popover,
} from "react-aria-components";
import { ChevronDown } from "~/icons/chevron";
import { parseDate } from "@internationalized/date";

type Props = { value?: string; onChange?: (v: DateValue) => void } & DatePickerProps<DateValue>;

export function BaseDatePicker({ value, onChange, ...props }: Props) {
  const [date, setDate] = useState<DateValue>();
  const handleChange = (v: DateValue) => {
    if (onChange) onChange(v);
    setDate(v);
  };

  useEffect(() => {
    if (value) setDate(parseDate(value));
  }, [value]);

  return (
    <DatePicker
      aria-label="Date Picker"
      shouldForceLeadingZeros
      className={`grid gap-2`}
      {...props}
      onChange={handleChange}
      value={date}
    >
      <Group
        className={clsx(
          "px-1.75 flex h-10 gap-2 rounded-lg border border-borderColor bg-mainBg py-2",
        )}
      >
        <DateInput className="flex items-center gap-1 px-2 leading-24">
          {(segment) => (
            <DateSegment
              className={({ isPlaceholder, isFocusVisible, isFocused }) =>
                clsx({
                  "px-1 italic text-gray-400": isPlaceholder,
                  "bg-blue-500 !text-white": isFocusVisible || isFocused,
                })
              }
              segment={segment}
            />
          )}
        </DateInput>
        <Button aria-label="Open Calendar" className="ml-auto cursor-pointer px-2 outline-blue-500">
          <CalendarIcon />
        </Button>
      </Group>
      <Popover>
        <Dialog aria-label="Calendar" className={"rounded border border-gray-200 bg-white"}>
          <Calendar className={"p-4"}>
            <header className={"mb-4 grid h-6 grid-cols-[auto_1fr_auto] gap-4 [&_h2]:text-center"}>
              <Button className="-ml-2 px-2" slot="previous">
                <ChevronDown className="rotate-90" />
              </Button>
              <Heading />
              <Button className="-mr-2 px-2" slot="next">
                <ChevronDown className="-rotate-90" />
              </Button>
            </header>

            <CalendarGrid>
              <CalendarGridHeader className={"py-1 [&_tr]:grid [&_tr]:grid-cols-7 [&_tr]:gap-4"}>
                {(day) => <CalendarHeaderCell className="">{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody
                className={"grid gap-2 before:block [&_tr]:grid [&_tr]:grid-cols-7 [&_tr]:gap-4"}
              >
                {(date) => (
                  <CalendarCell
                    className={({ isOutsideMonth, isSelected }) =>
                      clsx("grid h-5 w-5 place-items-center rounded text-center", {
                        "cursor-auto !text-gray-400": isOutsideMonth,
                        "hover:outline hover:outline-1 hover:outline-blue-500": !isOutsideMonth,
                        "rounded bg-blue-500 text-white": isSelected,
                      })
                    }
                    date={date}
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  );
}

function CalendarIcon() {
  return (
    <i>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M16.25 2.65625H14.2188V1.875C14.2188 1.75068 14.1694 1.63145 14.0815 1.54354C13.9935 1.45564 13.8743 1.40625 13.75 1.40625C13.6257 1.40625 13.5065 1.45564 13.4185 1.54354C13.3306 1.63145 13.2812 1.75068 13.2812 1.875V2.65625H6.71875V1.875C6.71875 1.75068 6.66936 1.63145 6.58146 1.54354C6.49355 1.45564 6.37432 1.40625 6.25 1.40625C6.12568 1.40625 6.00645 1.45564 5.91854 1.54354C5.83064 1.63145 5.78125 1.75068 5.78125 1.875V2.65625H3.75C3.45992 2.65625 3.18172 2.77148 2.9766 2.9766C2.77148 3.18172 2.65625 3.45992 2.65625 3.75V16.25C2.65625 16.5401 2.77148 16.8183 2.9766 17.0234C3.18172 17.2285 3.45992 17.3438 3.75 17.3438H16.25C16.5401 17.3438 16.8183 17.2285 17.0234 17.0234C17.2285 16.8183 17.3438 16.5401 17.3438 16.25V3.75C17.3438 3.45992 17.2285 3.18172 17.0234 2.9766C16.8183 2.77148 16.5401 2.65625 16.25 2.65625ZM3.75 3.59375H5.78125V4.375C5.78125 4.49932 5.83064 4.61855 5.91854 4.70646C6.00645 4.79436 6.12568 4.84375 6.25 4.84375C6.37432 4.84375 6.49355 4.79436 6.58146 4.70646C6.66936 4.61855 6.71875 4.49932 6.71875 4.375V3.59375H13.2812V4.375C13.2812 4.49932 13.3306 4.61855 13.4185 4.70646C13.5065 4.79436 13.6257 4.84375 13.75 4.84375C13.8743 4.84375 13.9935 4.79436 14.0815 4.70646C14.1694 4.61855 14.2188 4.49932 14.2188 4.375V3.59375H16.25C16.2914 3.59375 16.3312 3.61021 16.3605 3.63951C16.3898 3.66882 16.4062 3.70856 16.4062 3.75V6.40625H3.59375V3.75C3.59375 3.70856 3.61021 3.66882 3.63951 3.63951C3.66882 3.61021 3.70856 3.59375 3.75 3.59375ZM16.25 16.4062H3.75C3.70856 16.4062 3.66882 16.3898 3.63951 16.3605C3.61021 16.3312 3.59375 16.2914 3.59375 16.25V7.34375H16.4062V16.25C16.4062 16.2914 16.3898 16.3312 16.3605 16.3605C16.3312 16.3898 16.2914 16.4062 16.25 16.4062Z"
          fill="#A9A29D"
        />
      </svg>
    </i>
  );
}
