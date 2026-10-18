import { expect, test } from "@playwright/test";

function watch(page: import("@playwright/test").Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    errors.push(message.text());
  });
  page.on("response", (response) => {
    const url = response.url();
    if (!url.startsWith("http://127.0.0.1:3456")) return;
    if (response.status() >= 400) errors.push(`${response.status()} ${url}`);
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
    await expect(page.locator(".plan-day")).toHaveCount(120);
    const phaseNames = [
      "01 Foundations",
      "02 Azure networking and identity",
      "03 CI and delivery",
      "04 Terraform and application",
      "05 Kubernetes",
      "06 AKS",
      "07 Infrastructure delivery",
      "08 Reliability",
      "09 RAG and controlled tool use",
      "10 Design and defence",
    ];
    for (const name of phaseNames) {
      const button = page.getByRole("button", { name: new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\ /g, "\\s+")) });
      await expect(button).toBeVisible();
      await button.click();
      await expect(button).toHaveAttribute("aria-current", "true");
    }

    await page.getByRole("button", { name: /05\s+Kubernetes/ }).click();
    await page.getByRole("button", { name: /Day 37,/ }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Kubernetes control plane" })).toBeVisible();
    await expect(page.getByText("Planned. The lesson is not published.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Open lesson" })).toHaveCount(0);

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
    await expect(page.locator("#plan-detail").getByText("Gate D12. Foundation.")).toBeVisible();
    await page.getByRole("button", { name: "D60 Kubernetes" }).click();
    await expect(page.getByRole("heading", { level: 2, name: "M3 mock" })).toBeVisible();
    await expect(page.locator("#plan-detail").getByText("Gate D60. Kubernetes.")).toBeVisible();
    await page.getByRole("button", { name: /Day 12,/ }).click();
    await page.getByRole("button", { name: "Save on this device" }).click();
    await expect(page.getByRole("button", { name: "Saved on this device" })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { level: 2, name: "M1 mock + LLM sampler" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Saved on this device" })).toBeVisible();

    await page.getByRole("button", { name: "Terraform", exact: true }).click();
    await expect(page.getByText("Create cloud infrastructure from code.")).toBeVisible();
    await expect(page.locator(".plan-day.is-dim").first()).toBeVisible();
    await page.getByRole("button", { name: "Clear skill" }).click();
    await expect(page.getByText("Choose a skill to mark the days that use it.")).toBeVisible();
    await expect(page.locator(".plan-day.is-dim")).toHaveCount(0);

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
