import { expect, test } from "@playwright/test";

test("Talking with Rho can turn off automatic reading", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "dialogue" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };

  await page.goto(body.learnUrl);
  await expect(page.getByText("Talking with Rho")).toBeVisible();
  await expect(page.getByRole("button", { name: "Camp needs" })).toBeHidden();

  const autoRead = page.getByRole("switch", { name: "Automatic reading by Rho" });
  await expect(autoRead).toHaveAttribute("aria-checked", "false");
  await expect(autoRead).toContainText("Auto read off");

  await autoRead.click();
  await expect(autoRead).toHaveAttribute("aria-checked", "true");
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("primer.rhoTtsAutoRead")))
    .toBe("1");

  await autoRead.click();
  await expect(autoRead).toHaveAttribute("aria-checked", "false");
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("primer.rhoTtsAutoRead")))
    .toBe("0");

  await page.reload();
  await expect(page.getByText("Talking with Rho")).toBeVisible();
  await expect(page.getByRole("switch", { name: "Automatic reading by Rho" })).toHaveAttribute(
    "aria-checked",
    "false"
  );
});
