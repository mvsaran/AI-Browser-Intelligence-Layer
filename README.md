# 🤖 AI Browser Intelligence Layer

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI_GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)

![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blue?style=flat-square)
![AI Powered](https://img.shields.io/badge/AI-Powered-blueviolet?style=flat-square&logo=openai)

**Stop writing selectors. Start writing intentions.**

*The world's most readable browser automation framework — powered by GPT-4o.*

</div>

---

## 📖 Table of Contents

- [What is this?](#-what-is-this)
- [Why does it exist?](#-why-does-it-exist)
- [How it works — in plain English](#-how-it-works--in-plain-english)
- [Prerequisites](#-prerequisites)
- [Setup for a brand new project](#-setup-for-a-brand-new-project)
- [Project structure explained](#-project-structure-explained)
- [Writing your first test](#-writing-your-first-test)
- [Page Object Model with AI](#-page-object-model-with-ai)
- [Running the tests](#-running-the-tests)
- [Benefits](#-benefits)
- [Using this on a new e-commerce project](#-using-this-on-a-new-e-commerce-project)
- [When to use AI vs direct locators](#-when-to-use-ai-vs-direct-locators)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)

---

## 🤔 What is this?

This is a **browser automation framework** — a tool that controls a web browser automatically to test websites.

But unlike traditional tools, it understands **plain English instructions** instead of needing you to find and hardcode technical selectors like `#submit-btn-2` or `div.cart > button:nth-child(3)`.

**Traditional way:**
```typescript
await page.click('#login-button');          // breaks if ID changes
await page.fill('.username-input', 'john'); // breaks if class changes
```

**This framework:**
```typescript
await agent.execute('Click the login button');       // never breaks
await agent.execute('Type "john" in the username');  // survives any UI change
```

The AI reads the page the same way a human would — looks at labels, button text, and placeholders — then finds and interacts with the right thing automatically.

---

## 💡 Why does it exist?

Every QA engineer has felt this pain:

> *"The developer renamed a CSS class. Now 47 tests are failing. None of them are actual bugs."*

Traditional test automation is **brittle by design**. It relies on exact element IDs, CSS paths, or XPath expressions. The moment a developer touches the UI — even just to clean up — your tests break.

This framework solves that permanently by:

- ✅ Never depending on element IDs, CSS classes, or XPath
- ✅ Finding elements the way a human tester would — by what they *look like* and *say*
- ✅ Automatically adapting when the DOM changes
- ✅ Making tests readable by anyone — developers, PMs, even clients

---

## 🧠 How it works — in plain English

Think of it as a **three-person team** working together on every single action:

```
┌──────────────────────────────────────────────────────────┐
│  You write:  "Click the Add to Cart button"              │
└───────────────────────┬──────────────────────────────────┘
                        │
          ┌─────────────▼──────────────┐
          │   👁️  The SCOUT            │
          │   (src/browser)            │
          │                            │
          │   Scans the entire page    │
          │   Finds all buttons,       │
          │   inputs, links, labels    │
          └─────────────┬──────────────┘
                        │ Sends a map of the page
          ┌─────────────▼──────────────┐
          │   🧠  The THINKER          │
          │   (src/ai — GPT-4o)        │
          │                            │
          │   Reads your instruction   │
          │   + the page map           │
          │   Decides which element    │
          │   matches your intent      │
          └─────────────┬──────────────┘
                        │ Sends back: action + target
          ┌─────────────▼──────────────┐
          │   🤝  The DOER             │
          │   (src/executor)           │
          │                            │
          │   Clicks, types, selects   │
          │   Tries multiple strategies│
          │   if the first one fails   │
          └────────────────────────────┘
```

The whole cycle happens in under a second per action. You just see the browser doing the right thing.

---

## ✅ Prerequisites

Before setting up this project on any machine, make sure you have the following installed and ready.

### 1. Node.js (version 18 or higher)

Node.js is the runtime that executes the TypeScript code.

> **Check if you have it:** Open Terminal and run:
> ```bash
> node --version
> ```
> You should see something like `v20.11.0`. Anything 18+ is fine.

> **Don't have it?** Download from [nodejs.org](https://nodejs.org) — pick the **LTS** version.

---

### 2. npm (comes bundled with Node.js)

npm is the package manager that downloads all the libraries this project needs.

> **Check:** `npm --version` → should show `9.x.x` or higher

---

### 3. An OpenAI API Key with GPT-4o access

This is what powers the AI brain of the system.

> **Steps to get one:**
> 1. Create an account at [platform.openai.com](https://platform.openai.com)
> 2. Go to **API Keys** in the left sidebar
> 3. Click **Create new secret key** — give it a name like `ai-browser-layer`
> 4. Copy and save it immediately — you cannot see it again after closing
> 5. Ensure your account has **GPT-4o access** (requires adding billing details)

> ⚠️ **Cost note:** Each test action = one GPT-4o API call. A full 7-step checkout flow costs roughly $0.02–0.05.

---

### 4. Git

For cloning the repository.

> **Check:** `git --version`
> **Don't have it?** Download from [git-scm.com](https://git-scm.com)

---

### 5. VS Code (recommended editor)

> Download from [code.visualstudio.com](https://code.visualstudio.com)
>
> Recommended extensions:
> - **Playwright Test for VS Code** — run and debug tests from the editor sidebar
> - **ESLint** — catches TypeScript errors as you type

---

### Prerequisites checklist

```bash
node --version    # must be v18.0.0 or higher
npm --version     # must be 9.0.0 or higher
git --version     # any version works
# OpenAI API key — saved in a safe place, ready to paste
```

All four green? You're ready for setup.

---

## 🚀 Setup for a brand new project

Follow these steps exactly, in order. Do not skip any step.

### Step 1 — Clone the repository

Open Terminal, navigate to where you want the project folder, then run:

```bash
git clone <your-repository-url>
cd AIBROWSERINTELLIGANCE-LAYER
```

> 💡 `cd` means "change directory" — it moves you inside the project folder.

---

### Step 2 — Install all dependencies

This downloads every library the project needs (Playwright, TypeScript, OpenAI SDK, etc.):

```bash
npm install
```

> ⏳ Takes 1–3 minutes the first time. A lot of text will scroll — that is normal.

---

### Step 3 — Install Playwright browsers

Playwright needs to download actual browser engines (Chromium, Firefox, WebKit):

```bash
npx playwright install
```

> ⏳ Downloads roughly 200MB of browser binaries. Only needed once per machine.

---

### Step 4 — Create your environment file

This file stores your secret API key locally. **Never commit this file to Git** — it's already in `.gitignore`.

```bash
# Mac / Linux
cp .env.example .env

# Windows Command Prompt
copy .env.example .env
```

Now open `.env` in your editor and fill in your values:

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
BASE_URL=https://www.saucedemo.com
| Variable | What it does |
|---|---|
| `OPENAI_API_KEY` | Your key from platform.openai.com |
| `BASE_URL` | The website you want to test |

> ⚠️ No spaces around the `=` sign. `KEY=value` is correct. `KEY = value` will break.

---

### Step 5 — Verify your setup works

Run the demo script to confirm everything is connected:

```bash
npx ts-node tests/demo.test.ts
```

You should see a browser open, navigate to the site, log in, add a product to the cart, and complete a checkout — all automatically with no human input.

If you see `Demo completed successfully!` in the terminal — you're fully set up. 🎉

---

### Step 6 — Run the full test suite

```bash
npx playwright test
```

View the HTML report:

```bash
npx playwright show-report
```

---

## 📂 Project structure explained

Every file and folder, and what it does:

```
AIBROWSERINTELLIGANCE-LAYER/
│
├── 📁 src/                          ← The AI engine (you rarely edit this)
│   ├── 📁 ai/
│   │   ├── agent.ts                 ← AIAgent class — your main tool in tests
│   │   └── AIService.ts             ← Talks to OpenAI GPT-4o API
│   ├── 📁 browser/
│   │   └── ContextExtractor.ts      ← Scans the page DOM for interactive elements
│   ├── 📁 executor/
│   │   └── ActionExecutor.ts        ← Performs clicks, typing, navigation
│   └── index.ts                     ← Main export (AIBrowserIntelligence)
│
├── 📁 pages/                        ← YOUR page objects (add new ones here)
│   ├── LoginPage.ts                 ← Actions on the login page
│   ├── ProductPage.ts               ← Actions on the product listing page
│   ├── CartPage.ts                  ← Actions on the cart page
│   └── CheckoutPage.ts              ← Actions across the checkout flow
│
├── 📁 fixtures/
│   └── agent.fixture.ts             ← Injects AIAgent into every test automatically
│
├── 📁 tests/                        ← YOUR test files (add new ones here)
│   ├── checkout.test.ts             ← Full end-to-end checkout test
│   └── demo.test.ts                 ← Quick demo / sanity script
│
├── 📁 test-results/                 ← Auto-generated after each run
├── 📁 playwright-report/            ← Auto-generated HTML report
├── 📁 screenshots/                  ← Auto-captured on test failures
│
├── playwright.config.ts             ← Playwright settings (browsers, timeouts, reporters)
├── global-setup.ts                  ← Runs before all tests (validates API key exists)
├── .env                             ← Your secrets — never commit this file
├── .env.example                     ← Safe template — commit this instead
├── tsconfig.json                    ← TypeScript compiler settings
└── package.json                     ← Project dependencies and scripts
```

### The two folders you work in every day

| Folder | Your job here |
|---|---|
| `/pages` | One file per page of your app. Add new page objects here. |
| `/tests` | One file per feature or flow. Add new tests here. |

Everything in `/src` is the AI engine — you don't need to touch it unless you want to swap the AI model or add custom logging.

---

## ✍️ Writing your first test

Follow this exact pattern for every new test you write.

### Step 1 — Create a page object in `/pages`

```typescript
// pages/SearchPage.ts
import { AIAgent } from '../src/ai/agent';

export class SearchPage {

  constructor(private agent: AIAgent) {}

  /** Types a search term and submits the search */
  async searchFor(term: string): Promise<void> {
    await this.agent.execute(`Type "${term}" into the search box`);
    await this.agent.execute('Press the Search button');
  }

  /** Clicks on a product result by its display name */
  async selectProduct(productName: string): Promise<void> {
    await this.agent.execute(`Click on the product named "${productName}"`);
  }
}
```

> **The rule:** Every method calls `agent.execute()` with a plain English sentence describing what a human would do. No CSS. No XPath. No IDs. Ever.

---

### Step 2 — Write a test in `/tests`

```typescript
// tests/search.test.ts
import { test, expect } from '../fixtures/agent.fixture';
import { LoginPage }  from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';

test('user can search and find a product', async ({ page, agent }) => {

  const login  = new LoginPage(agent);
  const search = new SearchPage(agent);

  // Actions — always go through page objects + agent
  await login.login('standard_user', 'secret_sauce');
  await search.searchFor('backpack');
  await search.selectProduct('Sauce Labs Backpack');

  // Assertions — always use expect() directly, never agent
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.getByText('$29.99')).toBeVisible();
});
```

> **The golden rule:** Actions use `agent`. Assertions use `expect`. Never mix them.

---

### Step 3 — Run your new test

```bash
# Run just this test file
npx playwright test tests/search.test.ts

# Run with browser visible so you can watch it
npx playwright test tests/search.test.ts --headed

# Step through one action at a time
npx playwright test tests/search.test.ts --debug
```

---

## 🗂️ Page Object Model with AI

The Page Object Model (POM) is a design pattern where each page of your app gets its own class. This keeps tests short, readable, and prevents copy-pasting the same steps across files.

### Traditional POM vs AI POM — side by side

```typescript
// ❌ Traditional POM — full of fragile selectors
export class LoginPage {
  private usernameInput = this.page.locator('#user-name');
  private passwordInput = this.page.locator('#password');
  private loginButton   = this.page.locator('#login-button');

  constructor(private page: Page) {}

  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);   // breaks if #user-name changes
    await this.passwordInput.fill(pass);   // breaks if #password changes
    await this.loginButton.click();        // breaks if #login-button changes
  }
}

// ✅ AI POM — zero selectors, zero maintenance
export class LoginPage {
  constructor(private agent: AIAgent) {}

  async login(user: string, pass: string) {
    await this.agent.execute(`Fill the username field with "${user}"`);
    await this.agent.execute(`Fill the password field with "${pass}"`);
    await this.agent.execute('Click the login button');
  }
}
```

When the developer renames `#user-name` to `#username` next sprint, the AI POM keeps working. The traditional POM breaks immediately.

### How the existing pages in this project are built

```typescript
// pages/CartPage.ts
export class CartPage {
  constructor(private agent: AIAgent) {}

  async addProduct(productName: string) {
    await this.agent.execute(`Click "Add to cart" for ${productName}`);
  }

  async openCart() {
    await this.agent.execute('Click the shopping cart icon');
  }

  async proceedToCheckout() {
    await this.agent.execute('Click the Checkout button');
  }
}
```

```typescript
// pages/CheckoutPage.ts
export class CheckoutPage {
  constructor(private agent: AIAgent) {}

  async fillShippingDetails(first: string, last: string, zip: string) {
    await this.agent.execute(`Enter "${first}" as first name`);
    await this.agent.execute(`Enter "${last}" as last name`);
    await this.agent.execute(`Enter "${zip}" as postal code`);
    await this.agent.execute('Click continue');
  }

  async confirmOrder() {
    await this.agent.execute('Click the Finish button');
  }
}
```

### Checklist for adding a new page object

- [ ] Create `pages/YourPageName.ts`
- [ ] Import `AIAgent` from `../src/ai/agent`
- [ ] Add a constructor: `constructor(private agent: AIAgent) {}`
- [ ] Write one method per user action on that page
- [ ] Each method calls `agent.execute()` with a clear English sentence
- [ ] Add JSDoc comment to each method describing what it does
- [ ] No locators anywhere in the file

Done. No other configuration is needed.

---

## ▶️ Running the tests

### Common commands

```bash
# Run everything
npx playwright test

# Run a specific file
npx playwright test tests/checkout.test.ts

# Run with browser visible (great for debugging)
npx playwright test --headed

# Run in slow motion — pauses 500ms between actions (great for demos)
npx playwright test --headed --project=debug

# Step through one action at a time interactively
npx playwright test --debug

# Run only tests matching a keyword
npx playwright test --grep "checkout"

# Run only smoke-tagged tests
npx playwright test --grep @smoke

# Open the interactive HTML report
npx playwright show-report

# Run the original quick demo script
npx ts-node tests/demo.test.ts
```

### Understanding the HTML report

After any `npx playwright test` run, open the report:

```bash
npx playwright show-report
```

The report shows:
- ✅ Passed / ❌ Failed / ⏭️ Skipped counts
- Time taken per test
- Screenshot at the point of failure (auto-captured)
- Full action log with what the AI decided for each intent
- Retry history if you configured retries

---

## 🌟 Benefits

### For QA engineers

| Pain before | Relief now |
|---|---|
| Spent 40% of sprint fixing broken selectors | Zero selector maintenance |
| Tests written in cryptic XPath nobody understands | Tests read like manual test cases |
| Junior testers needed weeks to learn locator strategy | Anyone can write a test on day one |
| Every UI sprint broke the test suite | UI changes no longer break tests |
| Separate "automation" skill required | Plain English is the only skill required |

### For developers

| Before | After |
|---|---|
| Renamed a CSS class → 20 test failures, QA angry | Renamed a CSS class → 0 test failures |
| UI refactors required coordinating with QA | UI refactors are safe to ship anytime |
| Test code was a second codebase to maintain | Tests are readable documentation |

### For the business

- 🚀 **Faster releases** — QA is no longer the bottleneck after UI changes
- 💰 **Lower maintenance cost** — no dedicated "fix the selectors" sprints
- 📋 **Living documentation** — tests read like acceptance criteria anyone can review
- 🌐 **Cross-environment stability** — same test file runs on Dev, Staging, and Production without changes

---

## 🛒 Using this on a new e-commerce project

This section answers the most common question when teams adopt this framework:

> *"Our app is completely different — different platform, different CSS, different component library. Do we have to rewrite everything?"*

**No. You change one line.**

---

### The core idea: the framework doesn't know your app, and that's the point

Traditional frameworks need you to *teach* them your app — write locators, map every element, build page objects full of selectors before you can test a single thing.

This framework flips that. Because it reads the page like a human does, it works on **any** e-commerce site out of the box. Shopify, Magento, WooCommerce, a custom React storefront — the AI figures out what "Add to Cart button" looks like on that specific site automatically.

---

### Step 1 — Change one line to point at the new site

```env
# .env
BASE_URL=https://shop.newbrand.com
```

That is the only configuration change. The framework has no stored knowledge of your old site to unlearn.

---

### Step 2 — Write page objects in plain English for the new site

You don't reverse-engineer selectors. You describe actions the way a user would perform them:

```typescript
// pages/ProductPage.ts — works on ANY e-commerce site
export class ProductPage {
  constructor(private agent: AIAgent) {}

  async searchForProduct(name: string) {
    await this.agent.execute(`Type "${name}" in the search bar`);
    await this.agent.execute('Press the search button or hit Enter');
  }

  async selectSize(size: string) {
    await this.agent.execute(`Select size "${size}" from the size options`);
  }

  async selectColour(colour: string) {
    await this.agent.execute(`Choose the colour "${colour}"`);
  }

  async addToCart() {
    await this.agent.execute('Click the Add to Cart button');
  }

  async addToWishlist() {
    await this.agent.execute('Click the wishlist or save for later button');
  }
}
```

This exact file works whether the site is Shopify, Magento, WooCommerce, or a fully custom storefront. Zero changes needed when you switch platforms.

---

### Real e-commerce scenarios this handles well

#### 1. Product discovery & search

```typescript
test('user can find a product via search and filters', async ({ page, agent }) => {
  const home    = new HomePage(agent);
  const search  = new SearchPage(agent);
  const product = new ProductPage(agent);

  await home.navigate();
  await search.searchFor('running shoes');
  await search.filterByBrand('Nike');
  await search.sortBy('Price: Low to High');
  await product.selectFirstResult();

  await expect(page.getByText('Nike')).toBeVisible();
});
```

The `filterByBrand` and `sortBy` intents work regardless of whether the site uses a sidebar, a dropdown, a modal, or chip-based filters — the AI finds the right control automatically.

---

#### 2. Size and variant selection — the most fragile part of any e-commerce suite

Size selectors are notoriously different across platforms — radio buttons, dropdowns, clickable tiles, modals. With traditional automation you need a different locator strategy per site. With this framework:

```typescript
// Traditional — different selector per platform
await page.click('button[data-size="M"]');          // Shopify
await page.selectOption('#size-select', 'Medium');  // WooCommerce
await page.click('.size-tile:has-text("M")');       // Custom React

// This framework — same line, every platform
await agent.execute('Select size Medium');
```

---

#### 3. Guest checkout vs account checkout

```typescript
// pages/CheckoutPage.ts
async continueAsGuest() {
  await this.agent.execute('Continue as guest or skip account creation');
}

async loginWithExistingAccount(email: string, password: string) {
  await this.agent.execute(`Sign in with email "${email}"`);
  await this.agent.execute(`Enter password "${password}"`);
  await this.agent.execute('Click sign in or login');
}
```

Different sites present this choice as a modal, a page split, or a toggle. The intent survives all of them.

---

#### 4. Address and payment forms

```typescript
async fillShippingAddress(address: Address) {
  await this.agent.execute(`Enter "${address.line1}" in the street address field`);
  await this.agent.execute(`Enter "${address.city}" in the city field`);
  await this.agent.execute(`Select "${address.country}" from the country dropdown`);
  await this.agent.execute(`Enter "${address.postcode}" in the postcode field`);
}

async fillCardDetails(card: CardDetails) {
  await this.agent.execute(`Enter "${card.number}" in the card number field`);
  await this.agent.execute(`Enter "${card.expiry}" in the expiry date field`);
  await this.agent.execute(`Enter "${card.cvv}" in the CVV or security code field`);
}
```

Whether the payment form is Stripe, Braintree, Razorpay, or custom-built — the same intent works.

---

#### 5. Coupon and promo code application

```typescript
async applyPromoCode(code: string) {
  await this.agent.execute('Click the promo code or discount code field');
  await this.agent.execute(`Enter "${code}" in the promo code field`);
  await this.agent.execute('Click Apply');
}
```

Sites call this field "Coupon", "Promo Code", "Discount Code", "Gift Card", "Voucher" — the AI matches whichever label the site uses without any changes to your test.

---

#### 6. Order confirmation

```typescript
async verifyOrderPlaced(page: Page) {
  await expect(
    page.getByText(/order confirmed|thank you for your order|order placed/i)
  ).toBeVisible();
}
```

---

### A complete starter test suite for any new e-commerce site

This is the folder structure to aim for after roughly one day of setup on a new project:

```
tests/
├── 🚨 smoke/
│   ├── homepage.test.ts         ← site loads, nav works, search bar present
│   └── product-page.test.ts    ← PDPs load, variants are selectable
│
├── ⚙️ functional/
│   ├── search.test.ts           ← search, filters, sorting, pagination
│   ├── cart.test.ts             ← add, remove, update quantity, empty cart
│   ├── wishlist.test.ts         ← save item, move to cart, remove
│   ├── checkout-guest.test.ts   ← full guest checkout flow
│   ├── checkout-auth.test.ts    ← full logged-in checkout flow
│   └── promo-codes.test.ts      ← valid code, invalid code, expired code
│
└── 🔁 regression/
    ├── cross-browser.test.ts    ← same flows on Firefox + WebKit
    └── mobile-viewport.test.ts  ← same flows at 375px width
```

None of these test files contain a single CSS selector. The entire suite migrates to a different e-commerce platform by updating `BASE_URL` and rewriting the English sentences in page objects to match the new site's terminology — typically half a day's work.

---

### Where you still need to be thoughtful

The framework is not magic in every situation. Three cases need deliberate handling:

**iframes (e.g. Stripe, PayPal payment widgets)**

Payment fields embedded in a third-party iframe are sandboxed and invisible to the DOM scanner. Handle these with `agent.direct()` using Playwright's `frameLocator`, then resume AI for the rest:

```typescript
// Payment iframe — bypass AI, use direct Playwright
const cardFrame = page.frameLocator('iframe[name="card-number"]');
await cardFrame.getByPlaceholder('Card number').fill('4242424242424242');

// Back to AI for everything after the iframe
await agent.execute('Click the Place Order button');
```

**Captchas**

No automation framework solves these by design. Use test-mode bypass keys in your test environments — reCAPTCHA v2 test keys, Stripe test mode, etc.

**Real payment processing**

Always use sandbox credentials (`4242 4242 4242 4242` for Stripe, etc.) in automated tests. Never run real transactions in a test suite.

---

### The practical pitch to a new project team

If you're joining a new e-commerce project and want to introduce this framework:

> *"Instead of spending the first two sprints mapping selectors and building a brittle locator library, we write tests in plain English from day one. When the design team changes the checkout button's ID next sprint — and they will — our tests keep running. The only maintenance we do is when the user journey changes, not when the CSS changes."*

That framing lands. Selector maintenance is a pain every developer and QA engineer has felt personally.

---

## ⚖️ When to use AI vs direct locators

The single most important pattern to understand in this framework:

```
agent.execute()   →  every ACTION  (clicking, typing, navigating, selecting)
expect()          →  every ASSERTION  (text visible, URL correct, value present)
page.locator()    →  ONLY inside expect() calls or network waits
```

### Full decision table

| What you want to do | Correct approach |
|---|---|
| Click any button or link | `agent.execute('Click the Submit button')` |
| Fill a form field | `agent.execute('Type "hello@test.com" in the email field')` |
| Select from a dropdown | `agent.execute('Select "United States" from the country dropdown')` |
| Navigate via a menu item | `agent.execute('Click the Home link in the navigation')` |
| Upload a file | `agent.execute('Upload a file using the file picker')` |
| Check that text is visible | `expect(page.getByText('Order confirmed')).toBeVisible()` |
| Check the current URL | `expect(page).toHaveURL('/dashboard')` |
| Check an input's value | `expect(page.getByLabel('Email')).toHaveValue('test@test.com')` |
| Check element count | `expect(page.locator('.product-card')).toHaveCount(6)` |
| Wait for an API response | `await page.waitForResponse('/api/orders')` |
| Performance-sensitive loops | Direct Playwright locator — skip AI to save latency |

### Why keep assertions direct?

Assertions are a yes/no question — "does this text exist?" doesn't need AI interpretation. Using `agent.execute()` for assertions would add $0.01 cost and 200–500ms latency to every single check, for zero benefit. Keep them fast and deterministic.

---

---

## 🔧 Troubleshooting

### `Error: OPENAI_API_KEY is not set`

Your `.env` file is missing or the key is wrong.

```bash
cat .env   # check the file exists and contains your key
```

Common mistakes:
```env
OPENAI_API_KEY=sk-proj-abc123     ✅ correct
OPENAI_API_KEY = sk-proj-abc123   ❌ spaces around = will break it
OPENAI_API_KEY="sk-proj-abc123"   ❌ quotes are not needed
```

---

### `Error: Cannot find module '../src/index'`

You're in the wrong directory, or `npm install` wasn't run.

```bash
cd AIBROWSERINTELLIGANCE-LAYER   # make sure you're in the project root
npm install                       # re-run in case it was incomplete
```

---

### Browser opens but nothing happens / wrong element clicked

The AI couldn't match your intent to an element. Make it more specific:

```typescript
// Too vague — might match multiple buttons on the page
await agent.execute('Click the button');

// Specific enough to be unambiguous
await agent.execute('Click the "Add to cart" button next to Sauce Labs Backpack');
```

---

### Tests pass locally but fail in CI

Check that your CI pipeline has:
1. `OPENAI_API_KEY` set as a secret environment variable (not committed to code)
2. `npx playwright install` run as a step before the test step
3. Node.js 18+ in the CI environment image

---

### `TimeoutError: waiting for element to be visible`

The page took longer than the default timeout. Increase it in `playwright.config.ts`:

```typescript
use: {
  actionTimeout: 30_000,    // 30 seconds per action
  navigationTimeout: 60_000, // 60 seconds for page loads
}
```

---

### Tests are slow

Each `agent.execute()` call waits for a GPT-4o response (~200–500ms). For a 10-step test, expect 2–5 seconds just in AI latency on top of browser time. This is expected and normal. If you need pure speed, use `agent.direct()` for the stable parts.

---

## ❓ FAQ

**Q: Do I need to know how to code to use this?**
You need basic TypeScript — enough to write a class with methods. The methods themselves just contain plain English sentences. Much easier than learning XPath or CSS selectors.

---

**Q: What websites can I test?**
Any website a browser can open — internal tools, public sites, staging environments, apps behind a login. Just update `BASE_URL` in `.env`.

---

**Q: Does it work on sites behind a VPN or internal network?**
Yes. The browser it controls runs on your machine, so it can access anything your machine can access, including VPN-protected internal apps.

---

**Q: What if the AI picks the wrong element?**
Make your intent more descriptive. Instead of `"Click the button"`, try `"Click the blue Submit button at the bottom of the checkout form"`. The AI responds well to visual context clues.

---

**Q: Can I use a different AI model instead of GPT-4o?**
Yes. Change the model in `src/ai/AIService.ts`. Any model that accepts a system prompt and returns structured JSON will work — Claude, Gemini, or local models via Ollama.

---

**Q: Is my page content sent to OpenAI?**
The visible text, button labels, aria-labels, and placeholders of each page are sent to GPT-4o so it can find elements. Actual user-entered values (passwords, credit card numbers) are not included in the context sent to the API — only the structural metadata of the page.

---

**Q: How do I add this to an existing Playwright project?**
1. Copy the `/src` folder into your project
2. Run `npm install openai`
3. Add `OPENAI_API_KEY` to your `.env`
4. Replace brittle `page.click(selector)` calls with `agent.execute(intent)` where you want resilience
5. Keep all `expect()` assertions exactly as they are

---

---

## 🩹 AI Self-Healing (HealerAgent)

The framework includes a built-in **HealerAgent** that automatically triggers when a test fails. Instead of just giving you a stack trace, it uses AI to analyze the failure and provide a human-readable diagnosis and fix suggestion.

### What the HealerAgent does on failure:

1.  **Captures State**: Takes a full-page screenshot and extracts the current DOM context.
2.  **Analyzes Error**: Sends the error message, the last attempted intent, and the page state to GPT-4o.
3.  **Generates Report**: Logs a detailed "Healing Report" to the console and `execution.log`.

### Example Healing Report:

```text
[HealerAgent] 🚨 Test Failed: "should complete a successful purchase"
[HealerAgent] Error Message: [AIAgent] Failed to execute intent: "Click the Finish button"

--- HEALING REPORT ---
TEST: should complete a successful purchase
ANALYSIS: 
1. DIAGNOSIS: The "Finish" button could not be clicked because a "Cookie Consent" overlay was blocking the interaction.
2. HEALING SUGGESTION: Add a step to accept cookies at the start of the test, or update the intent to "Close the cookie banner and click Finish".
3. ALTERNATIVE LOCATOR: Use "data-test='accept-cookies'" to clear the overlay first.
----------------------
```

### How to use it:

The HealerAgent is integrated into the `agent.fixture.ts` and runs automatically. You don't need to write any extra code to benefit from it.

---

<div align="center">

---

Built with 🤖 AI + ☕ and a deep hatred of flaky selectors

*If this saved you from writing one more XPath — it was worth it.*

</div>