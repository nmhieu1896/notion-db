/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactElement } from "react";
type ShowProps = {
  when: any;
  children: ReactElement | ReactElement[];
};

export default function Show({ when, children }: ShowProps) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return when ? <>{children}</> : null;
}
