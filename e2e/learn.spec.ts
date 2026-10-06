import { expect, test } from "@playwright/test";

function watch(page: import("@playwright/test").Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !/Failed to load resource/.test(message.text())) errors.push(message.text());
  });
  return errors;
}

test.describe("120-day plan", () => {
  test("selects phases, days, gates, skills, and saved days", async ({ page }) => {
    const errors = watch(page);
    await page.goto("/learn");
    await expect(page.getByRole("heading", { level: 1, name: "FORGE-120" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Day 1,/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Day 120,/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /05\s+Kubernetes/ })).toBeVisible();

    await page.getByRole("button", { name: /05\s+Kubernetes/ }).click();
    await page.getByRole("button", { name: /Day 37,/ }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Kubernetes control plane" })).toBeVisible();
    await expect(page.getByText("Planned. The lesson is not published.")).toBeVisible();

    await page.getByRole("button", { name: /Day 1,/ }).click();
    await page.getByRole("link", { name: "Open lesson" }).click();
    await expect(page).toHaveURL(/\/learn\/day-01/);
    await page.goBack();
    await expect(page).toHaveURL(/\/learn/);

    await page.goto("/learn#day-59");
    await expect(page.getByRole("heading", { level: 2, name: "First LLM helper read-only" })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { level: 2, name: "First LLM helper read-only" })).toBeVisible();
    await page.goto("/learn#day-97");
    await expect(page.getByRole("heading", { level: 2, name: "RAG terms and chunking" })).toBeVisible();

    await page.getByLabel("Jump to day").fill("Day 59");
    await page.getByRole("button", { name: "Go", exact: true }).click();
    await expect(page.getByRole("heading", { level: 2, name: "First LLM helper read-only" })).toBeVisible();

    const foundations = page.getByRole("button", { name: /01\s+Foundations/ });
    await foundations.focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("button", { name: /02\s+Azure networking and identity/ })).toHaveAttribute("aria-current", "true");

    await page.getByRole("button", { name: /Day 12,/ }).click();
    await expect(page.getByText("Gate D12. Foundation.")).toBeVisible();
    await page.getByRole("button", { name: "Save on this device" }).click();
    await expect(page.getByRole("button", { name: "Saved on this device" })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { level: 2, name: "M1 mock + LLM sampler" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Saved on this device" })).toBeVisible();

    await page.getByRole("button", { name: "Terraform", exact: true }).click();
    await expect(page.getByText("Create cloud infrastructure from code.")).toBeVisible();

    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow, String(width)).toBe(false);
    }
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("continue uses progress stored on this device", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "theairishi_learner_progress_v1",
        JSON.stringify({
          v: 1,
          completed: ["day-01"],
          started: ["day-01"],
          lastVisited: "day-01",
          completedAt: { "day-01": "2026-01-01T00:00:00.000Z" },
          saved: [],
        }),
      );
    });
    await page.goto("/learn");
    await expect(page.getByRole("link", { name: "Continue Day 2" }).first()).toBeVisible();
  });
});
