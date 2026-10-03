// src/lib/utils/mjmlGenerator.ts
import type { EmailTemplate, SectionBlock, ColumnBlock, ContentBlock } from '#lib/types/email.js';
import { BLOCK_REGISTRY } from '#lib/blocks/index.js';

export interface MjmlGeneratorOptions {
	/** When true, embeds editor selection classes and postMessage event handlers for the canvas preview */
	forCanvas?: boolean;
}

export function templateToMjml(
	template: EmailTemplate,
	options: MjmlGeneratorOptions = {}
): string {
	const { forCanvas = false } = options;

	const sectionsHtml = (template.body || [])
		.map((section: SectionBlock) => {
			const sectionClass = forCanvas ? `css-class="mf-selectable mf-id-${section.id}"` : '';
			const sectionPadding = section.padding ? `padding="${section.padding}"` : '';

			const columnsHtml = (section.children || [])
				.map((column: ColumnBlock) => {
					const columnClass = forCanvas ? `css-class="mf-selectable mf-id-${column.id}"` : '';
					const columnBg = column.backgroundColor
						? `background-color="${column.backgroundColor}"`
						: '';
					const columnPadding = column.padding ? `padding="${column.padding}"` : '';

					const blocksHtml = (column.children || [])
						.map((block: ContentBlock) => {
							const plugin = BLOCK_REGISTRY[block.type];
							if (plugin?.toMjml) {
								return plugin.toMjml(block, { forCanvas });
							}
							return '';
						})
						.filter(Boolean)
						.join('\n');

					return `<mj-column width="${column.width || '100%'}" ${columnClass} ${columnBg} ${columnPadding}>\n${blocksHtml}\n</mj-column>`;
				})
				.join('\n');

			return `<mj-section background-color="${section.backgroundColor || 'transparent'}" ${sectionPadding} ${sectionClass}>\n${columnsHtml}\n</mj-section>`;
		})
		.join('\n');

	const canvasScript = forCanvas
		? `
    <mj-style>
      .mf-selectable {
        transition: outline 0.15s ease-in-out;
        cursor: pointer;
      }
      .mf-selectable:hover {
        outline: 2px dashed #0284c7 !important;
        outline-offset: 2px;
      }
    </mj-style>
    <mj-raw>
      <script>
        document.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const target = e.target.closest('[class*="mf-id-"]');
          if (target) {
            const match = target.className.match(/mf-id-([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
              window.parent.postMessage({ type: 'FROSTMAIL_BLOCK_CLICK', blockId: match[1] }, '*');
            }
          }
        }, true);
      </script>
    </mj-raw>`
		: '';

	const fontFamily = template.globalStyles?.fontFamily || 'Inter, Helvetica, Arial, sans-serif';
	const bgColor = template.globalStyles?.backgroundColor || '#f4f4f4';
	const contentWidth = template.globalStyles?.contentWidth || '600px';

	return `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="${fontFamily}" />
    </mj-attributes>
    <mj-preview>${template.preheader || ''}</mj-preview>
    ${canvasScript}
  </mj-head>
  <mj-body background-color="${bgColor}" width="${contentWidth}">
    ${sectionsHtml}
  </mj-body>
</mjml>`;
}
