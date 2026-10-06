import { expect, test } from "@playwright/test";
import { build } from "esbuild";

test("account switch component recovers from a failed logout and navigates after success", async ({ page }) => {
  // Exercise the real component while isolating its network boundary from dev-server outages.
  const result = await build({
    stdin: {
      contents: 'import React from "react"; import {createRoot} from "react-dom/client"; import AccountSwitchButton from "./components/settings/AccountSwitchButton"; createRoot(document.getElementById("root")).render(<AccountSwitchButton />);',
      resolveDir: process.cwd(), loader: "tsx",
    },
    bundle: true, write: false, platform: "browser", jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
  });
  const bundle = result.outputFiles[0].text;
  await page.route("**/account-switch-fixture", (route) => route.fulfill({ contentType: "text/html", body: '<main id="root"></main><script src="/account-switch-bundle.js"></script>' }));
  await page.route("**/account-switch-bundle.js", (route) => route.fulfill({ contentType: "application/javascript", body: bundle }));
  let attempts = 0;
  await page.route("**/api/auth/logout", (route) => {
    attempts++;
    return route.fulfill({ status: attempts === 1 ? 503 : 200, json: { ok: attempts > 1 } });
  });
  await page.route("**/login", (route) => route.fulfill({ contentType: "text/html", body: "<h1>Sign in</h1>" }));
  await page.goto("/account-switch-fixture");
  await page.getByRole("button", { name: "Switch account", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText("Could not switch accounts. Try again.");
  await expect(page.getByRole("button", { name: "Switch account", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Switch account", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Sign in", exact: true })).toBeVisible();
  expect(attempts).toBe(2);
});
