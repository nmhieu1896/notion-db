import { Controller, useFormContext } from "react-hook-form";
import { BaseDatePicker } from "./BaseDatePicker";

type ControlledProps = {
  name: string;
} & React.ComponentProps<typeof BaseDatePicker>;
export function FormDatePicker({ name, ...props }: ControlledProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <BaseDatePicker
          {...props}
          value={field.value}
          onChange={(v) => {
            field.onChange(
              `${v.year}-${v.month.toString().padStart(2, "0")}-${v.day.toString().padStart(2, "0")}`,
            );
          }}
        />
      )}
    />
  );
}
