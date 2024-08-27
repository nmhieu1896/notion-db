/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";

type CaseProps = {
  when: any;
  children: JSX.Element | JSX.Element[] | false | null;
  as?: keyof JSX.IntrinsicElements;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Case({ when, ...props }: CaseProps) {
  if (!props.children) return null;
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment {...props} />;
}

type SwitchProps = {
  children: React.ReactElement<CaseProps>[];
};

function Root({ children }: SwitchProps) {
  const showChild = children[children.findIndex((el) => !!el.props.when)] || null;
  return showChild;
}

export default { Root, Case };
