// src/lib/stores/studio.svelte.ts
import { browser } from '$app/environment';
import { SvelteDate } from 'svelte/reactivity';
import type {
	EmailTemplate,
	AnyBlock,
	SectionBlock,
	ColumnBlock,
	ContentBlock,
	CompilerResult,
	SavedProject
} from '$lib/types/email';
import { TEMPLATE_PRESETS } from '$lib/constants/presets';

function findBlockInTree(id: string, sections: SectionBlock[]): AnyBlock | null {
	if (!Array.isArray(sections)) return null;
	for (const section of sections) {
		if (section.id === id) return section;
		for (const col of section.children || []) {
			if (col.id === id) return col;
			for (const block of col.children || []) {
				if (block.id === id) return block;
			}
		}
	}
	return null;
}

function findBlockLocation(
	body: SectionBlock[],
	blockId: string
): {
	section: SectionBlock;
	column: ColumnBlock;
	parentArray: ContentBlock[];
	index: number;
} | null {
	for (const section of body) {
		for (const col of section.children || []) {
			const index = (col.children || []).findIndex((b) => b.id === blockId);
			if (index !== -1) {
				return {
					section,
					column: col,
					parentArray: col.children as ContentBlock[],
					index
				};
			}
		}
	}
	return null;
}

function findColumnLocation(
	body: SectionBlock[],
	columnId: string
): { section: SectionBlock; index: number } | null {
	for (const section of body) {
		const index = (section.children || []).findIndex((c) => c.id === columnId);
		if (index !== -1) {
			return { section, index };
		}
	}
	return null;
}

const DEFAULT_MOCK_DATA = JSON.stringify(
	{
		user: {
			name: 'Alex Johnson',
			email: 'alex@example.com'
		},
		order: {
			id: '#48921',
			total: '€149.00'
		},
		reset_url: 'https://example.com/reset?token=live_test_123'
	},
	null,
	2
);

export class EmailStudioState {
	// Core Reactive State
	template = $state<EmailTemplate>(structuredClone(TEMPLATE_PRESETS.welcome));
	mockDataJson = $state<string>(DEFAULT_MOCK_DATA);
	selectedBlockId = $state<string | null>(null);
	compiledHtml = $state<string>('');
	emailSizeKb = $state<number>(0);
	isClippedInGmail = $state<boolean>(false);
	isCompiling = $state<boolean>(false);
	compileErrors = $state<CompilerResult['errors']>([]);
	previewMode = $state<'desktop' | 'mobile'>('desktop');
	simulateDarkMode = $state<boolean>(false);
	isSaved = $state<boolean>(true);

	// History State
	private history = $state<EmailTemplate[]>([]);
	private historyIndex = $state<number>(-1);
	private isApplyingHistory = false;
	private debounceTimer: ReturnType<typeof setTimeout> | null = null;
	private autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

	// Projects Library State
	savedProjects = $state<SavedProject[]>([
		{
			id: 'proj_welcome_default',
			name: 'Welcome Onboarding',
			updatedAt: new SvelteDate().toISOString(),
			template: structuredClone(TEMPLATE_PRESETS.welcome)
		},
		{
			id: 'proj_reset_default',
			name: 'Password Reset',
			updatedAt: new SvelteDate().toISOString(),
			template: structuredClone(TEMPLATE_PRESETS.passwordReset)
		},
		{
			id: 'proj_receipt_default',
			name: 'Order Receipt',
			updatedAt: new SvelteDate().toISOString(),
			template: structuredClone(TEMPLATE_PRESETS.receipt)
		}
	]);
	currentProjectId = $state<string | null>('proj_welcome_default');

	constructor() {
		if (browser) {
			this.loadFromLocalStorage();
			this.pushHistory(this.template);
			this.triggerCompile();
		}
	}

	// Derived Getters
	selectedBlock = $derived.by(() => {
		if (!this.selectedBlockId || !this.template?.body) return null;
		return findBlockInTree(this.selectedBlockId, this.template.body);
	});

	parsedMockData = $derived.by(() => {
		try {
			return JSON.parse(this.mockDataJson || '{}') as Record<string, unknown>;
		} catch {
			return {};
		}
	});

	canUndo = $derived(this.historyIndex > 0);
	canRedo = $derived(this.historyIndex < this.history.length - 1);

	activeProjectName = $derived.by(() => {
		const current = this.savedProjects.find((p) => p.id === this.currentProjectId);
		return current?.name || this.template?.name || 'Untitled Template';
	});

	// History Management
	private pushHistory(snap: EmailTemplate) {
		if (this.isApplyingHistory) return;
		const clone = structuredClone($state.snapshot(snap));
		// Discard redo stack
		if (this.historyIndex < this.history.length - 1) {
			this.history = this.history.slice(0, this.historyIndex + 1);
		}
		this.history.push(clone);
		if (this.history.length > 25) {
			this.history.shift();
		}
		this.historyIndex = this.history.length - 1;
	}

	undo = () => {
		if (!this.canUndo) return;
		this.isApplyingHistory = true;
		this.historyIndex -= 1;
		const prev = this.history[this.historyIndex];
		if (prev) {
			this.template = structuredClone(prev);
			this.onTemplateChanged();
		}
		this.isApplyingHistory = false;
	};

	redo = () => {
		if (!this.canRedo) return;
		this.isApplyingHistory = true;
		this.historyIndex += 1;
		const next = this.history[this.historyIndex];
		if (next) {
			this.template = structuredClone(next);
			this.onTemplateChanged();
		}
		this.isApplyingHistory = false;
	};

	// Change listener & Debounced Compiler
	onTemplateChanged = () => {
		this.isSaved = false;
		if (!this.isApplyingHistory) {
			this.pushHistory(this.template);
		}
		this.scheduleCompile();
		this.scheduleAutoSave();
	};

	scheduleCompile = () => {
		if (this.debounceTimer) clearTimeout(this.debounceTimer);
		this.debounceTimer = setTimeout(() => {
			this.triggerCompile();
		}, 250);
	};

	private scheduleAutoSave = () => {
		if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
		this.autoSaveTimer = setTimeout(() => {
			this.saveToLocalStorage();
			this.autoSyncActiveProject();
			this.isSaved = true;
		}, 500);
	};

	triggerCompile = async () => {
		if (!browser) return;
		this.isCompiling = true;
		try {
			const res = await fetch('/api/compiler/compile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					template: $state.snapshot(this.template),
					mockData: this.parsedMockData
				})
			});
			if (res.ok) {
				const data = (await res.json()) as CompilerResult;
				this.compiledHtml = data.html;
				this.compileErrors = data.errors;
				this.emailSizeKb = data.sizeKb;
				this.isClippedInGmail = data.isClippedInGmail;
			}
		} catch (err) {
			console.error('Compilation failed:', err);
		} finally {
			this.isCompiling = false;
		}
	};

	// Selection
	selectBlock = (id: string | null) => {
		this.selectedBlockId = id;
	};

	// Section & Layout Management
	addSection = () => {
		return this.addLayoutSection(['100%']);
	};

	addLayoutSection = (columns: string[] = ['100%']) => {
		if (!this.template.body) this.template.body = [];
		const newSection: SectionBlock = {
			id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			type: 'section',
			backgroundColor: '#ffffff',
			children: columns.map((w) => ({
				id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
				type: 'column',
				width: w,
				children: []
			}))
		};
		this.template.body.push(newSection);
		this.selectedBlockId = newSection.id;
		this.onTemplateChanged();
		return newSection;
	};

	addColumnToSection = (sectionId: string, width = '100%') => {
		if (!this.template?.body) return;
		const section = this.template.body.find((s) => s.id === sectionId);
		if (!section) return;
		if (!section.children) section.children = [];

		const newCol: ColumnBlock = {
			id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			type: 'column',
			width,
			children: []
		};
		section.children.push(newCol);
		this.selectedBlockId = newCol.id;
		this.onTemplateChanged();
	};

	removeColumn = (columnId: string) => {
		if (!this.template?.body) return;
		const loc = findColumnLocation(this.template.body, columnId);
		if (loc) {
			loc.section.children.splice(loc.index, 1);
			if (this.selectedBlockId === columnId) {
				this.selectedBlockId = null;
			}
			this.onTemplateChanged();
		}
	};

	moveSection = (direction: 'up' | 'down', sectionId: string) => {
		if (!this.template?.body) return;
		const idx = this.template.body.findIndex((s) => s.id === sectionId);
		if (idx === -1) return;
		const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
		if (targetIdx >= 0 && targetIdx < this.template.body.length) {
			const [moved] = this.template.body.splice(idx, 1);
			if (moved) this.template.body.splice(targetIdx, 0, moved);
			this.onTemplateChanged();
		}
	};

	duplicateSection = (sectionId: string) => {
		if (!this.template?.body) return;
		const idx = this.template.body.findIndex((s) => s.id === sectionId);
		if (idx === -1) return;
		const original = this.template.body[idx];
		if (original) {
			const clone = structuredClone($state.snapshot(original));
			clone.id = `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
			for (const col of clone.children || []) {
				col.id = `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
				for (const block of col.children || []) {
					block.id = `${block.type}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
				}
			}
			this.template.body.splice(idx + 1, 0, clone);
			this.selectedBlockId = clone.id;
			this.onTemplateChanged();
		}
	};

	removeSection = (sectionId: string) => {
		if (!this.template?.body) return;
		this.template.body = this.template.body.filter((s) => s.id !== sectionId);
		if (this.selectedBlockId === sectionId) {
			this.selectedBlockId = null;
		}
		this.onTemplateChanged();
	};

	// Block Manipulation (Contextual Insertion)
	addBlock = (factory: () => ContentBlock) => {
		const newBlock = factory();
		if (!this.template.body) this.template.body = [];

		// Case 1: If a content block is selected, insert directly after it in that column
		if (this.selectedBlockId) {
			const blockLoc = findBlockLocation(this.template.body, this.selectedBlockId);
			if (blockLoc) {
				blockLoc.parentArray.splice(blockLoc.index + 1, 0, newBlock);
				this.selectedBlockId = newBlock.id;
				this.onTemplateChanged();
				return;
			}

			// Case 2: If a column is selected, append to that column
			for (const sec of this.template.body) {
				const col = (sec.children || []).find((c) => c.id === this.selectedBlockId);
				if (col) {
					if (!col.children) col.children = [];
					col.children.push(newBlock);
					this.selectedBlockId = newBlock.id;
					this.onTemplateChanged();
					return;
				}
			}

			// Case 3: If a section is selected, insert into its first column
			const sec = this.template.body.find((s) => s.id === this.selectedBlockId);
			if (sec) {
				if (!sec.children || sec.children.length === 0) {
					sec.children = [
						{
							id: `col_${Date.now()}`,
							type: 'column',
							width: '100%',
							children: []
						}
					];
				}
				const firstCol = sec.children[0];
				if (firstCol) {
					if (!firstCol.children) firstCol.children = [];
					firstCol.children.push(newBlock);
					this.selectedBlockId = newBlock.id;
					this.onTemplateChanged();
					return;
				}
			}
		}

		// Fallback: Append to last section's last column (or create new section)
		let targetSection = this.template.body[this.template.body.length - 1];
		if (!targetSection) {
			targetSection = {
				id: `sec_${Date.now()}`,
				type: 'section',
				backgroundColor: '#ffffff',
				children: []
			};
			this.template.body.push(targetSection);
		}

		if (!targetSection.children || targetSection.children.length === 0) {
			targetSection.children = [
				{
					id: `col_${Date.now()}`,
					type: 'column',
					width: '100%',
					children: []
				}
			];
		}

		const targetCol = targetSection.children[targetSection.children.length - 1];
		if (targetCol) {
			if (!targetCol.children) targetCol.children = [];
			targetCol.children.push(newBlock);
		}

		this.selectedBlockId = newBlock.id;
		this.onTemplateChanged();
	};

	moveBlock = (direction: 'up' | 'down', blockId: string) => {
		if (!this.template?.body) return;
		const loc = findBlockLocation(this.template.body, blockId);
		if (!loc) return;
		const targetIdx = direction === 'up' ? loc.index - 1 : loc.index + 1;
		if (targetIdx >= 0 && targetIdx < loc.parentArray.length) {
			const [moved] = loc.parentArray.splice(loc.index, 1);
			if (moved) loc.parentArray.splice(targetIdx, 0, moved);
			this.onTemplateChanged();
		}
	};

	duplicateBlock = (blockId: string) => {
		if (!this.template?.body) return;
		const loc = findBlockLocation(this.template.body, blockId);
		if (!loc) return;
		const original = loc.parentArray[loc.index];
		if (original) {
			const clone = structuredClone($state.snapshot(original));
			clone.id = `${clone.type}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
			loc.parentArray.splice(loc.index + 1, 0, clone);
			this.selectedBlockId = clone.id;
			this.onTemplateChanged();
		}
	};

	removeBlock = (blockId: string) => {
		if (!this.template?.body) return;
		const loc = findBlockLocation(this.template.body, blockId);
		if (loc) {
			loc.parentArray.splice(loc.index, 1);
			if (this.selectedBlockId === blockId) {
				this.selectedBlockId = null;
			}
			this.onTemplateChanged();
			return;
		}

		// Also check if it was a column or section
		const colLoc = findColumnLocation(this.template.body, blockId);
		if (colLoc) {
			this.removeColumn(blockId);
			return;
		}

		this.removeSection(blockId);
	};

	resetToPreset = (presetKey: keyof typeof TEMPLATE_PRESETS) => {
		this.template = structuredClone(TEMPLATE_PRESETS[presetKey]);
		this.selectedBlockId = null;
		this.onTemplateChanged();
	};

	// Projects & Persistence
	private autoSyncActiveProject = () => {
		if (!this.currentProjectId || !this.template) return;
		const idx = this.savedProjects.findIndex((p) => p.id === this.currentProjectId);
		if (idx !== -1) {
			const active = this.savedProjects[idx];
			if (active) {
				active.template = structuredClone($state.snapshot(this.template));
				active.name = this.template.name || active.name;
				active.updatedAt = new SvelteDate().toISOString();
				this.saveProjectsToLocalStorage();
			}
		}
	};

	saveCurrentProject = async (customName?: string) => {
		const targetName = customName || this.template.name || 'Untitled Template';
		this.template.name = targetName;

		const newId = `proj_${Date.now()}`;
		this.savedProjects.unshift({
			id: newId,
			name: targetName,
			updatedAt: new SvelteDate().toISOString(),
			template: structuredClone($state.snapshot(this.template))
		});
		this.currentProjectId = newId;
		this.saveProjectsToLocalStorage();

		try {
			await fetch('/api/templates', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: newId,
					name: targetName,
					template: $state.snapshot(this.template)
				})
			});
		} catch {
			// Falls back to local storage
		}
	};

	loadProject = (project: SavedProject) => {
		this.currentProjectId = project.id;
		this.template = structuredClone(project.template);
		this.selectedBlockId = null;
		this.onTemplateChanged();
	};

	createNewBlankProject = () => {
		const blankId = `proj_${Date.now()}`;
		const newTemplate: EmailTemplate = {
			id: `tpl_${Date.now()}`,
			name: 'New Blank Email',
			subject: 'Subject Line',
			preheader: '',
			globalStyles: {
				fontFamily: 'Inter, Helvetica, Arial, sans-serif',
				backgroundColor: '#f8fafc',
				contentWidth: '600px'
			},
			body: [
				{
					id: `sec_${Date.now()}`,
					type: 'section',
					backgroundColor: '#ffffff',
					children: [
						{
							id: `col_${Date.now()}`,
							type: 'column',
							width: '100%',
							children: [
								{
									id: `txt_${Date.now()}`,
									type: 'text',
									content: '<p>Start typing your email content here...</p>'
								}
							]
						}
					]
				}
			]
		};

		this.savedProjects.unshift({
			id: blankId,
			name: newTemplate.name,
			updatedAt: new SvelteDate().toISOString(),
			template: newTemplate
		});

		this.currentProjectId = blankId;
		this.template = newTemplate;
		this.selectedBlockId = null;
		this.saveProjectsToLocalStorage();
		this.onTemplateChanged();
	};

	deleteProject = async (id: string) => {
		this.savedProjects = this.savedProjects.filter((p) => p.id !== id);
		this.saveProjectsToLocalStorage();

		try {
			await fetch(`/api/templates/${id}`, { method: 'DELETE' });
		} catch {
			// Ignored for local
		}

		if (this.savedProjects.length === 0) {
			this.createNewBlankProject();
			return;
		}

		if (this.currentProjectId === id) {
			const first = this.savedProjects[0];
			if (first) this.loadProject(first);
		}
	};

	syncCloudTemplates = async () => {
		if (!browser) return;
		try {
			const res = await fetch('/api/templates');
			if (res.ok) {
				const cloudList = (await res.json()) as SavedProject[];
				if (Array.isArray(cloudList) && cloudList.length > 0) {
					for (const item of cloudList) {
						const existingIdx = this.savedProjects.findIndex((p) => p.id === item.id);
						if (existingIdx !== -1) {
							this.savedProjects[existingIdx] = item;
						} else {
							this.savedProjects.unshift(item);
						}
					}
					this.saveProjectsToLocalStorage();
				}
			}
		} catch (err) {
			console.warn('Cloud template sync skipped:', err);
		}
	};

	private loadFromLocalStorage = () => {
		try {
			const savedTpl = localStorage.getItem('frostmail_current_template');
			if (savedTpl) {
				this.template = JSON.parse(savedTpl) as EmailTemplate;
			}
			const savedVars = localStorage.getItem('frostmail_mock_data');
			if (savedVars) {
				this.mockDataJson = savedVars;
			}
			const savedProjList = localStorage.getItem('frostmail_saved_projects');
			if (savedProjList) {
				this.savedProjects = JSON.parse(savedProjList) as SavedProject[];
			}
			const activeProj = localStorage.getItem('frostmail_active_project_id');
			if (activeProj) {
				this.currentProjectId = activeProj;
			}
		} catch (err) {
			console.warn('Failed to load state from localStorage:', err);
		}
	};

	private saveToLocalStorage = () => {
		if (!browser) return;
		try {
			localStorage.setItem(
				'frostmail_current_template',
				JSON.stringify($state.snapshot(this.template))
			);
			localStorage.setItem('frostmail_mock_data', this.mockDataJson);
		} catch (err) {
			console.warn('Failed to save state to localStorage:', err);
		}
	};

	private saveProjectsToLocalStorage = () => {
		if (!browser) return;
		try {
			localStorage.setItem(
				'frostmail_saved_projects',
				JSON.stringify($state.snapshot(this.savedProjects))
			);
			if (this.currentProjectId) {
				localStorage.setItem('frostmail_active_project_id', this.currentProjectId);
			}
		} catch (err) {
			console.warn('Failed to save projects to localStorage:', err);
		}
	};
}

// Global Singleton Instance
export const studio = new EmailStudioState();
