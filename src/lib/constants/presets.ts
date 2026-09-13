// src/lib/constants/presets.ts
import type { EmailTemplate } from '$lib/types/email';

export const TEMPLATE_PRESETS: Record<
	'welcome' | 'passwordReset' | 'receipt' | 'verification' | 'newsletter',
	EmailTemplate
> = {
	welcome: {
		id: 'tpl_welcome',
		name: 'Welcome Onboarding',
		subject: 'Welcome aboard! Let’s get you started',
		preheader: 'Complete your profile in 3 simple steps.',
		globalStyles: {
			fontFamily: 'Inter, Helvetica, Arial, sans-serif',
			backgroundColor: '#f8fafc',
			contentWidth: '600px'
		},
		body: [
			{
				id: 'sec_welcome_1',
				type: 'section',
				backgroundColor: '#ffffff',
				children: [
					{
						id: 'col_welcome_1',
						type: 'column',
						width: '100%',
						children: [
							{
								id: 'txt_welcome_h1',
								type: 'text',
								content:
									'<h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Welcome to FrostMail</h1><p style="color: #475569; font-size: 15px; line-height: 1.5;">We are thrilled to have you here. Your account is ready to build bulletproof transactional emails.</p>'
							},
							{
								id: 'btn_welcome_cta',
								type: 'button',
								label: 'Get Started Now',
								url: 'https://example.com/dashboard',
								backgroundColor: '#0284c7',
								color: '#ffffff',
								borderRadius: '6px'
							}
						]
					}
				]
			}
		]
	},
	passwordReset: {
		id: 'tpl_reset',
		name: 'Password Reset',
		subject: 'Reset your password request',
		preheader: 'Use this link to securely reset your password.',
		globalStyles: {
			fontFamily: 'Inter, Helvetica, Arial, sans-serif',
			backgroundColor: '#f1f5f9',
			contentWidth: '560px'
		},
		body: [
			{
				id: 'sec_reset_1',
				type: 'section',
				backgroundColor: '#ffffff',
				children: [
					{
						id: 'col_reset_1',
						type: 'column',
						width: '100%',
						children: [
							{
								id: 'txt_reset_h1',
								type: 'text',
								content:
									'<h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Password Reset Request</h2><p style="color: #475569; font-size: 14px; line-height: 1.5;">We received a request to reset your password. Click the button below to set a new one. This link expires in 15 minutes.</p>'
							},
							{
								id: 'btn_reset_cta',
								type: 'button',
								label: 'Reset Password',
								url: 'https://example.com/reset?token=xyz123',
								backgroundColor: '#dc2626',
								color: '#ffffff',
								borderRadius: '6px'
							},
							{
								id: 'txt_reset_footer',
								type: 'text',
								content:
									'<p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">If you didn’t request this password reset, you can safely ignore this email.</p>'
							}
						]
					}
				]
			}
		]
	},
	receipt: {
		id: 'tpl_receipt',
		name: 'Order Receipt',
		subject: 'Your receipt for Order #48921',
		preheader: 'Thank you for your purchase. Here is your payment summary.',
		globalStyles: {
			fontFamily: 'Inter, Helvetica, Arial, sans-serif',
			backgroundColor: '#f8fafc',
			contentWidth: '600px'
		},
		body: [
			{
				id: 'sec_receipt_1',
				type: 'section',
				backgroundColor: '#ffffff',
				children: [
					{
						id: 'col_receipt_1',
						type: 'column',
						width: '100%',
						children: [
							{
								id: 'txt_receipt_h1',
								type: 'text',
								content:
									'<h2 style="font-size: 22px; font-weight: 800; color: #0f172a;">Payment Received</h2><p style="color: #64748b; font-size: 14px;">Order #48921 &bull; August 27, 2026</p>'
							},
							{
								id: 'div_receipt_1',
								type: 'divider'
							},
							{
								id: 'txt_receipt_items',
								type: 'text',
								content:
									'<table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;"><tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0;">FrostMail Pro (Annual)</td><td style="text-align: right; font-weight: 600;">€149.00</td></tr><tr><td style="padding: 12px 0; font-weight: bold; color: #0f172a;">Total Paid</td><td style="text-align: right; font-weight: bold; color: #0f172a;">€149.00</td></tr></table>'
							},
							{
								id: 'btn_receipt_invoice',
								type: 'button',
								label: 'Download PDF Invoice',
								url: 'https://example.com/invoices/48921.pdf',
								backgroundColor: '#0f172a',
								color: '#ffffff',
								borderRadius: '6px'
							}
						]
					}
				]
			}
		]
	},
	verification: {
		id: 'tpl_verification',
		name: 'Security OTP Code',
		subject: 'Your 6-digit verification code: 849 204',
		preheader: 'Use this code to complete your two-factor login.',
		globalStyles: {
			fontFamily: 'Inter, Helvetica, Arial, sans-serif',
			backgroundColor: '#f8fafc',
			contentWidth: '560px'
		},
		body: [
			{
				id: 'sec_verify_1',
				type: 'section',
				backgroundColor: '#ffffff',
				children: [
					{
						id: 'col_verify_1',
						type: 'column',
						width: '100%',
						children: [
							{
								id: 'txt_verify_header',
								type: 'text',
								content:
									'<h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">Security Verification</h2><p style="color: #64748b; font-size: 14px; line-height: 1.5;">Please enter the following one-time verification code to securely access your account:</p>'
							},
							{
								id: 'txt_verify_code',
								type: 'text',
								content:
									'<div style="background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 18px; text-align: center; margin: 16px 0;"><span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0f172a;">849 204</span></div>'
							},
							{
								id: 'txt_verify_footer',
								type: 'text',
								content:
									'<p style="color: #94a3b8; font-size: 13px; line-height: 1.4;">This code will expire in <strong>10 minutes</strong>. If you did not initiate this request, please change your password immediately.</p>'
							}
						]
					}
				]
			}
		]
	},
	newsletter: {
		id: 'tpl_newsletter',
		name: 'Product Changelog',
		subject: 'FrostMail 2.0: Real-Time DNS Auditing & Faster MJML',
		preheader: 'Here is what we shipped this week across the platform.',
		globalStyles: {
			fontFamily: 'Inter, Helvetica, Arial, sans-serif',
			backgroundColor: '#0f172a',
			contentWidth: '600px'
		},
		body: [
			{
				id: 'sec_news_1',
				type: 'section',
				backgroundColor: '#ffffff',
				children: [
					{
						id: 'col_news_1',
						type: 'column',
						width: '100%',
						children: [
							{
								id: 'txt_news_badge',
								type: 'text',
								content:
									'<div style="display: inline-block; background-color: #ecfdf5; color: #059669; font-weight: bold; font-size: 12px; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">Product Changelog #24</div><h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 12px; margin-bottom: 8px;">What’s New in FrostMail</h1><p style="color: #475569; font-size: 15px; line-height: 1.6;">We just rolled out our largest update yet, featuring AST compilation speed improvements, live merge previews, and comprehensive DNS diagnostics.</p>'
							},
							{
								id: 'div_news_1',
								type: 'divider'
							},
							{
								id: 'txt_news_highlights',
								type: 'text',
								content:
									'<h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">🚀 Key Highlights</h3><ul style="color: #475569; font-size: 14px; line-height: 1.7; padding-left: 20px;"><li><strong>DNS Auditor:</strong> Check SPF, DKIM, and DMARC in milliseconds.</li><li><strong>Polar MoR Integration:</strong> Effortless subscription management.</li><li><strong>React Email Export:</strong> Generate typed .tsx components directly.</li></ul>'
							},
							{
								id: 'btn_news_cta',
								type: 'button',
								label: 'Read Full Release Notes',
								url: 'https://example.com/changelog',
								backgroundColor: '#10b981',
								color: '#ffffff',
								borderRadius: '6px'
							}
						]
					}
				]
			}
		]
	}
};

export const presets = TEMPLATE_PRESETS;
