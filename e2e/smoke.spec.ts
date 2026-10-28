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

  test("reduced motion still shows the path", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "FORGE-120" })).toBeVisible();
    await expect(page.getByRole("button", { name: /01\s*Foundations/ })).toBeVisible();
    await expect(page.getByText("ANCIENT WISDOM")).toHaveCount(0);
    const blur = await page.evaluate(() => getComputedStyle(document.querySelector(".command-bar") as Element).backdropFilter);
    expect(blur === "none" || blur === "").toBe(true);
    expect(await noHorizontalScroll(page)).toBe(true);
  });

  test("glass material is the shared surface", async ({ page }) => {
    await page.goto("/");
    const surface = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const bar = document.querySelector(".command-bar");
      const chapter = document.querySelector('.chapter:not([data-layout="rail"])');
      return {
        token: root.getPropertyValue("--glass-fill").trim(),
        ground: getComputedStyle(document.body).backgroundImage,
        shell: document.querySelector(".site-shell")?.getAttribute("data-tone") || "",
        barBg: bar ? getComputedStyle(bar).backgroundColor : "",
        chapterBg: chapter ? getComputedStyle(chapter).backgroundColor : "",
        atlas: document.querySelectorAll(".atlas").length,
      };
    });
    expect(surface.token.length).toBeGreaterThan(0);
    expect(surface.ground).toContain("gradient");
    expect(surface.shell).toBe("home");
    expect(surface.barBg).not.toBe("rgb(239, 232, 220)");
    expect(surface.chapterBg).not.toBe("rgb(229, 220, 207)");
    expect(surface.chapterBg).not.toBe("rgb(239, 232, 220)");
    expect(surface.atlas).toBe(0);
    const blur = await page.evaluate(() => getComputedStyle(document.querySelector(".command-bar") as Element).backdropFilter);
    expect(blur).toContain("blur");

    await page.goto("/learn/day-01");
    const lesson = await page.evaluate(() => {
      const main = document.querySelector("main.focus-bay");
      const column = document.querySelector("main.focus-bay #main-content");
      return {
        mainBg: main ? getComputedStyle(main).backgroundColor : "",
        columnBg: column ? getComputedStyle(column).backgroundColor : "",
      };
    });
    expect(lesson.mainBg).toBe("rgba(0, 0, 0, 0)");
    expect(lesson.columnBg).not.toBe("rgba(0, 0, 0, 0)");
    expect(lesson.columnBg).not.toBe("rgb(239, 232, 220)");

    await page.goto("/about");
    const about = await page.evaluate(() =>
      [...document.querySelectorAll(".story-chapter")].map((node) => getComputedStyle(node).backgroundColor),
    );
    expect(about[0]).toBe("rgb(36, 28, 22)");
    if (about.length > 1) {
      expect(about[1]).not.toBe("rgb(239, 232, 220)");
      expect(about[1]).not.toBe("rgba(0, 0, 0, 0)");
    }
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

  test("search locks the page, traps focus, and closes from the scrim", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Search published titles and summaries" });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    const field = dialog.getByRole("searchbox");
    await expect(dialog).toBeVisible();
    await expect(field).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    await page.keyboard.press("Shift+Tab");
    expect(await page.evaluate(() => document.querySelector("[role='dialog']")?.contains(document.activeElement))).toBe(true);

    await field.fill("zzzz-not-a-real-title");
    await expect(dialog.getByText(/No title, concept, or summary matches/)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");

    await trigger.click();
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    if (!box) throw new Error("search dialog has no box");
    await page.mouse.click(box.x + 8, box.y + box.height - 8);
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await page.route("**/api/search**", (route) => route.abort());
    await trigger.click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole("searchbox").fill("git");
    await expect(dialog.getByText("Search could not be loaded. Try again.")).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("phone widths keep phase names and do not scroll sideways", async ({ page }) => {
    for (const width of [320, 360, 390, 430]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      await expect(page.getByRole("button", { name: /05 Kubernetes/ })).toBeVisible();
      await expect(page.getByRole("link", { name: "Start Day 1" }).first()).toBeVisible();
      expect(await noHorizontalScroll(page), `overflow at ${width}`).toBe(true);
      const piled = await page.evaluate(() => {
        function box(el: Element) {
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, r: r.right, b: r.bottom };
        }
        function hit(a: { x: number; y: number; r: number; b: number }, b: { x: number; y: number; r: number; b: number }) {
          return a.x < b.r - 1 && a.r > b.x + 1 && a.y < b.b - 1 && a.b > b.y + 1;
        }
        const cards = [...document.querySelectorAll(".orbit-card")].map(box);
        let cardHit = false;
        for (let i = 0; i < cards.length; i += 1) {
          for (let j = i + 1; j < cards.length; j += 1) if (hit(cards[i], cards[j])) cardHit = true;
        }
        const title = document.querySelector("h1");
        const titleHit = title ? cards.some((card) => hit(card, box(title))) : false;
        const stations = [...document.querySelectorAll(".rail-station")].map(box);
        const stationHit = cards.some((card) => stations.some((station) => hit(card, station)));
        const positions = [...document.querySelectorAll(".orbit-card")].map((el) => getComputedStyle(el).position);
        return { cardHit, titleHit, stationHit, positions };
      });
      expect(piled.cardHit, `orbit cards overlap at ${width}`).toBe(false);
      expect(piled.titleHit, `orbit cards cover the title at ${width}`).toBe(false);
      expect(piled.stationHit, `orbit cards cover a phase at ${width}`).toBe(false);
      expect(piled.positions.every((position) => position === "static"), `orbit cards stay in flow at ${width}`).toBe(true);
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
