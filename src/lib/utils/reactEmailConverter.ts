// src/lib/utils/reactEmailConverter.ts
import type { EmailTemplate, SectionBlock, ColumnBlock, ContentBlock } from '$lib/types/email';
import { BLOCK_REGISTRY } from '$lib/blocks';

function toValidComponentName(name: string): string {
	const cleaned = name.replace(/[^a-zA-Z0-9]/g, '');
	if (!cleaned || /^[0-9]/.test(cleaned)) {
		return `Email${cleaned}`;
	}
	return cleaned;
}

export function templateToReactEmail(template: EmailTemplate): string {
	const componentName = toValidComponentName(template?.name || 'Template');

	const renderBlock = (block: ContentBlock): string => {
		const plugin = BLOCK_REGISTRY[block.type];
		if (plugin?.toReactEmail) {
			return plugin.toReactEmail(block);
		}
		return '';
	};

	const sectionsCode = (template?.body || [])
		.map((section: SectionBlock) => {
			const sectionBg = section.backgroundColor || '#ffffff';
			const paddingStyle = section.padding ? `padding: '${section.padding}', ` : '';

			return `          <Section style={{ backgroundColor: '${sectionBg}', ${paddingStyle}borderRadius: '8px', margin: '12px 0' }}>
            <Row>
${(section.children || [])
	.map((col: ColumnBlock) => {
		const colBg = col.backgroundColor ? `backgroundColor: '${col.backgroundColor}', ` : '';
		const colPadding = col.padding ? `padding: '${col.padding}', ` : '';
		return `              <Column style={{ width: '${col.width || '100%'}', ${colBg}${colPadding}}}>
${(col.children || []).map(renderBlock).filter(Boolean).join('\n')}
              </Column>`;
	})
	.join('\n')}
            </Row>
          </Section>`;
		})
		.join('\n');

	return `import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Button,
  Img,
  Link,
  Hr,
} from '@react-email/components';

interface ${componentName}Props {
  previewText?: string;
}

export const ${componentName} = ({
  previewText = '${template?.preheader || ''}',
}: ${componentName}Props) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: '${template?.globalStyles?.backgroundColor || '#f8fafc'}', fontFamily: '${template?.globalStyles?.fontFamily || 'sans-serif'}' }}>
        <Container style={{ maxWidth: '${template?.globalStyles?.contentWidth || '600px'}', margin: '0 auto', padding: '20px 0' }}>
${sectionsCode}
        </Container>
      </Body>
    </Html>
  );
};

export default ${componentName};
`;
}
