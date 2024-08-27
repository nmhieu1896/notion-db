import { Controller, useFormContext } from "react-hook-form";
import { BaseMultiSelect } from "./BaseMultiSelect";

type Props = {
  name: string;
  onChange?: (value: Set<string>) => void;
} & React.ComponentProps<typeof BaseMultiSelect>;
export function FormMultiSelect({ name, onChange, ...props }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <BaseMultiSelect
          onValueChange={(value) => {
            field.onChange(value);
            onChange?.(value);
          }}
          value={field.value}
          {...props}
        />
      )}
    />
  );
}
