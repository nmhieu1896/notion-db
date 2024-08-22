import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";

import { getClientEnv } from "./env.server";

export const loader = () => {
  return json({
    __env: getClientEnv(),
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { __env } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="root">{children}</div>
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV=${JSON.stringify(__env)};`,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
