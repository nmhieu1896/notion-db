import { Controller, useFormContext } from "react-hook-form";
import { BaseSelect } from "./BaseSelect";
import { useEffect } from "react";

type Props = {
  name: string;
  onChange?: (value: string) => void;
} & React.ComponentProps<typeof BaseSelect>;

export function FormSelect({ name, onChange, ...props }: Props) {
  const { control, getValues, setValue } = useFormContext();

  // if defaultSelectedKey is set, Select is not allowed to be empty
  useEffect(() => {
    if (props.defaultSelectedKey && getValues(name) === undefined) {
      setValue(name, props.defaultSelectedKey);
    }
  }, [getValues, name, props.defaultSelectedKey, setValue]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <BaseSelect
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
