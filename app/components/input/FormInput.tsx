import { useFormContext } from "react-hook-form";
import { BaseInput } from "./BaseInput";

type Props = {
  name: string;
} & React.ComponentProps<typeof BaseInput>;
export function FormInput({ name, ...props }: Props) {
  const { register, getValues } = useFormContext();

  return <BaseInput {...register(name)} {...props} value={getValues(name)} />;
}
