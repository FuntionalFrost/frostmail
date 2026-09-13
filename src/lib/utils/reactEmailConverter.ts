// src/lib/utils/reactEmailConverter.ts
import type { EmailTemplate, SectionBlock, ColumnBlock, ContentBlock } from '$lib/types/email';

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
		switch (block.type) {
			case 'text': {
				const alignClass =
					block.align === 'center'
						? 'text-center'
						: block.align === 'right'
							? 'text-right'
							: 'text-left';
				return `            <Text className="text-gray-800 m-0 ${alignClass}">\n              ${(block.content || '').replace(/<[^>]*>/g, '')}\n            </Text>`;
			}
			case 'button':
				return `            <Button\n              href="${block.url || '#'}"\n              style={{\n                backgroundColor: '${block.backgroundColor || '#0284c7'}',\n                color: '${block.color || '#ffffff'}',\n                borderRadius: '${block.borderRadius || '6px'}',\n                padding: '12px 20px',\n              }}\n            >\n              ${block.label || 'Button'}\n            </Button>`;
			case 'image': {
				const imgTag = `<Img src="${block.src || ''}" alt="${block.alt || ''}" width="${block.width || '100%'}" className="rounded-md" />`;
				if (block.href) {
					return `            <Link href="${block.href}">\n              ${imgTag}\n            </Link>`;
				}
				return `            ${imgTag}`;
			}
			case 'divider':
				return `            <Hr className="border-gray-200 my-4" />`;
			case 'spacer':
				return `            <Section style={{ height: '${block.height || '24px'}' }} />`;
			default:
				return '';
		}
	};

	const sectionsCode = (template?.body || [])
		.map(
			(
				section: SectionBlock
			) => `          <Section style={{ backgroundColor: '${section.backgroundColor || '#ffffff'}' }} className="p-6 rounded-lg my-3">
            <Row>
${(section.children || [])
	.map(
		(col: ColumnBlock) => `              <Column style={{ width: '${col.width || '100%'}' }}>
${(col.children || []).map(renderBlock).join('\n')}
              </Column>`
	)
	.join('\n')}
            </Row>
          </Section>`
		)
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
