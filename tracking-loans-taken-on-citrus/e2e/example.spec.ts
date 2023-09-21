import { siteConfig } from "@/config/site"
import { expect, test } from "@playwright/test"

test("has title", async ({ page }) => {
  await page.goto("./")

  await expect(page).toHaveTitle(siteConfig.name)
})
