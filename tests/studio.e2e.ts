import { expect, test } from '@playwright/test';
import { interpolateVariables } from '../src/lib/utils/interpolate';
import { templateToMjml } from '../src/lib/utils/mjmlGenerator';
import { templateToReactEmail } from '../src/lib/utils/reactEmailConverter';
import { presets } from '../src/lib/constants/presets';

test.describe('FrostMail Core AST Engine Unit Tests', () => {
	test('interpolateVariables handles nested keys and fallbacks', () => {
		const raw = 'Hello {{ user.name }}, order #{{ order.id }} has shipped!';
		const mockData = {
			user: { name: 'Alex' },
			order: { id: 'ORD-9821' }
		};
		const result = interpolateVariables(raw, mockData);
		expect(result).toBe('Hello Alex, order #ORD-9821 has shipped!');
	});

	test('interpolateVariables leaves unmatched keys unchanged', () => {
		const raw = 'Hello {{ missing.key }}!';
		const result = interpolateVariables(raw, {});
		expect(result).toBe('Hello {{ missing.key }}!');
	});

	test('templateToMjml generates valid MJML markup for presets', () => {
		const template = presets.welcome;
		const mjml = templateToMjml(template, { forCanvas: false });
		expect(mjml).toContain('<mjml>');
		expect(mjml).toContain('</mjml>');
		expect(mjml).toContain('<mj-body');
		expect(mjml).toContain('<mj-section');
	});

	test('templateToMjml injects block IDs when forCanvas is true', () => {
		const template = presets.welcome;
		const mjml = templateToMjml(template, { forCanvas: true });
		expect(mjml).toContain('mf-selectable');
		expect(mjml).toContain('mf-id-');
		expect(mjml).toContain('FROSTMAIL_BLOCK_CLICK');
	});

	test('templateToReactEmail generates JSX component string', () => {
		const template = presets.receipt;
		const reactCode = templateToReactEmail(template);
		expect(reactCode).toContain('import * as React');
		expect(reactCode).toContain('@react-email/components');
		expect(reactCode).toContain('export default OrderReceipt');
	});
});

test.describe('FrostMail Application Navigation & SEO E2E Tests', () => {
	test('Landing page renders hero, features, and SEO tags', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/FrostMail/);

		// Check hero CTA buttons
		const openStudioBtn = page.getByRole('link', { name: /Open Template Studio/i });
		await expect(openStudioBtn).toBeVisible();
		await expect(openStudioBtn).toHaveAttribute('href', '/editor');

		const auditDomainBtn = page.getByRole('link', { name: /Audit Domain DNS/i });
		await expect(auditDomainBtn).toBeVisible();
		await expect(auditDomainBtn).toHaveAttribute('href', '/diagnostic');

		// Check pricing cards
		await expect(page.getByText('Community')).toBeVisible();
		await expect(page.getByText('FrostMail Pro', { exact: true })).toBeVisible();
	});

	test('Editor page loads with sidebar, canvas iframe, and inspector', async ({ page }) => {
		await page.goto('/editor');
		await expect(page).toHaveTitle(/FrostMail/);

		// Top toolbar actions
		await expect(page.getByRole('button', { name: /Export/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /Send Test/i })).toBeVisible();

		// Sidebar tabs
		await expect(page.getByRole('tab', { name: /Blocks/i })).toBeVisible();
		await expect(page.getByRole('tab', { name: /Layers/i })).toBeVisible();
		await expect(page.getByRole('tab', { name: /Vars/i })).toBeVisible();

		// Check live preview iframe
		const iframe = page.locator('iframe[title="Email Preview"]');
		await expect(iframe).toBeVisible();
	});

	test('DNS diagnostic auditor loads and accepts domain search', async ({ page }) => {
		await page.goto('/diagnostic');
		await expect(page).toHaveTitle(/DNS/);

		const input = page.getByPlaceholder(/e\.g\. yourcompany\.com/i);
		await expect(input).toBeVisible();
		await expect(page.getByRole('button', { name: /Audit Domain/i })).toBeVisible();
	});

	test('Login page loads high-contrast form with tabs and social sign-in', async ({ page }) => {
		await page.goto('/login');
		await expect(page).toHaveTitle(/Sign In \/ Register/i);
		await expect(page.getByRole('tab', { name: /Sign In/i })).toBeVisible();
		await expect(page.getByRole('tab', { name: /Create Account/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /Continue with GitHub/i })).toBeVisible();
		await expect(page.getByPlaceholder('alex@company.com')).toBeVisible();
	});

	test('Legal pages render with yaxa-svelte compliance content', async ({ page }) => {
		for (const route of ['/privacy', '/terms', '/refunds', '/impressum']) {
			await page.goto(route);
			await expect(page.getByRole('link', { name: /Back to FrostMail/i })).toBeVisible();
			await expect(page.locator('article, main')).toBeVisible();
		}
	});
});
