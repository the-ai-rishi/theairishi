import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function quietPage(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    if (/Failed to load resource: the server responded with a status of 404/.test(msg.text())) return;
    errors.push(msg.text());
  });
  page.on("response", (response) => {
    const url = response.url();
    if (!url.startsWith("http://127.0.0.1:3456")) return;
    if (response.status() >= 400 && !url.includes("/not-a-real-page")) {
      errors.push(`${response.status()} ${url}`);
    }
  });
  return errors;
}

async function clickClear(locator: ReturnType<Page["getByRole"]>) {
  await locator.evaluate((element) => element.scrollIntoView({ block: "center", inline: "nearest" }));
  await locator.click();
}

async function noHorizontalScroll(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
}

test.describe("FORGE-120 smoke", () => {
  test("homepage explains the path and the rail", async ({ page }) => {
    const errors = await quietPage(page);
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "FORGE-120" })).toBeVisible();
    await expect(page.getByText("FORGE-120 is a 120-day hands-on learning path.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Start Day 1" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore the 120-day plan" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /05\s*Kubernetes/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /09\s*RAG and controlled tool use/ })).toBeVisible();
    await expect(page.getByText("ANCIENT WISDOM")).toHaveCount(0);
    await expect(page.locator(".atlas")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "What you will practise" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Why this order" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "How one day works" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Where AI enters" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ready to start?" })).toBeVisible();
    await expect(page.getByText("Fixed example. Not a live model, and not a live index.")).toBeVisible();

    await clickClear(page.getByRole("button", { name: /^0?3?\s*Break$/ }));
    await expect(page.getByText("Break one thing safely. Write down what you saw.")).toBeVisible();
    await clickClear(page.getByRole("button", { name: "Cite", exact: true }));
    await expect(page.getByText("The answer points at the source. If it cannot, it should not pretend.")).toBeVisible();

    await page.getByRole("button", { name: /05\s*Kubernetes/ }).click();
    await expect(page.getByRole("button", { name: /05\s*Kubernetes/ })).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#phase-05")).toBeVisible();

    const foundations = page.getByRole("button", { name: /01\s*Foundations/ });
    await foundations.focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("button", { name: /02\s*Azure networking and identity/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await page.goto("/#day-3");
    await expect(page.getByText("Merge vs rebase")).toBeVisible();
    await page.getByRole("link", { name: /Day 1, Contract, repo, honesty/ }).click();
    await expect(page).toHaveURL(/\/learn\/day-01/);

    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByRole("link", { name: "Start Day 1" }).first().click();
    await expect(page).toHaveURL(/\/learn\/day-01/);
    await page.goBack();
    await expect(page).toHaveURL(/\/(#|$)/);
    await expect(page.getByRole("heading", { level: 1, name: "FORGE-120" })).toBeVisible();

    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("major routes, search, and 404", async ({ page }) => {
    const errors = await quietPage(page);
    for (const path of ["/", "/learn", "/learn/day-01", "/learn/day-03", "/guides", "/guides/first-principles-ai-learning", "/projects", "/projects/forge-api", "/about"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBeLessThan(400);
      await expect(page.locator("main, #main-content").first()).toBeVisible();
    }

    await page.goto("/");
    await page.getByRole("button", { name: "Search published titles and summaries" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);

    const missing = await page.goto("/not-a-real-page");
    expect(missing?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    expect(errors.filter((item) => !item.includes("/not-a-real-page")), errors.join("\n")).toEqual([]);
  });

  test("phone widths keep phase names and do not scroll sideways", async ({ page }) => {
    for (const width of [320, 360, 390, 430]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      await expect(page.getByRole("button", { name: /05 Kubernetes/ })).toBeVisible();
      await expect(page.getByRole("link", { name: "Start Day 1" }).first()).toBeVisible();
      expect(await noHorizontalScroll(page), `overflow at ${width}`).toBe(true);
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const dock = page.getByRole("navigation", { name: "Sections" });
    await expect(dock).toBeVisible();
    await dock.getByRole("link", { name: "120 Days" }).click();
    await expect(page).toHaveURL(/\/learn/);
  });

  test("accessibility scan of the major routes", async ({ page }) => {
    for (const path of ["/", "/learn", "/learn/day-01", "/guides", "/projects", "/about"]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      expect(results.violations, `${path}: ${results.violations.map((item) => item.id).join(", ")}`).toEqual([]);
    }
  });
});
