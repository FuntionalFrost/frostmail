<!-- src/lib/components/MjmlCodeBlock.svelte -->
<script lang="ts">
	import { tokenizeMarkup } from '#lib/utils/mjmlHighlighter.js';
	import { tokenizeCode } from 'yaxa-svelte';
	import { Copy, Check } from '@lucide/svelte';

	interface Props {
		code: string;
		language?: string;
		filename?: string;
		showLineNumbers?: boolean;
		showCopy?: boolean;
		maxHeight?: string;
		wrap?: boolean;
		class?: string;
	}

	let {
		code,
		language = 'mjml',
		filename,
		showLineNumbers = true,
		showCopy = true,
		maxHeight,
		wrap = false,
		class: className = ''
	}: Props = $props();

	let copied = $state(false);

	type UnifiedToken = {
		text: string;
		type: string;
	};

	let tokenizedLines = $derived.by<UnifiedToken[][]>(() => {
		const cleanCode = code ? code.trimEnd() : '';
		const lang = language.toLowerCase();

		if (lang === 'mjml' || lang === 'xml' || lang === 'html') {
			return tokenizeMarkup(cleanCode, lang);
		}

		// Use yaxa tokenizer for typescript/react/json
		return tokenizeCode(cleanCode, lang);
	});

	async function copyCode() {
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}
</script>

<div
	class="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 font-mono text-xs text-neutral-200 shadow-xl transition-colors dark:border-neutral-800/90 dark:bg-neutral-950 {className}"
>
	<!-- Header Bar (if filename, language, or copy is displayed) -->
	{#if filename || showCopy}
		<div
			class="flex shrink-0 items-center justify-between border-b border-neutral-800/80 bg-neutral-900/90 px-3.5 py-2 backdrop-blur-xs select-none"
		>
			<div class="flex items-center gap-2 overflow-hidden">
				<div class="flex items-center gap-1.5">
					<span class="h-2 w-2 rounded-full bg-rose-500/80"></span>
					<span class="h-2 w-2 rounded-full bg-amber-500/80"></span>
					<span class="h-2 w-2 rounded-full bg-emerald-500/80"></span>
				</div>
				{#if filename}
					<span class="truncate font-medium text-neutral-300">
						{filename}
					</span>
				{/if}
				<span
					class="rounded bg-neutral-800/90 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-neutral-400 uppercase"
				>
					{language}
				</span>
			</div>

			{#if showCopy}
				<button
					type="button"
					onclick={copyCode}
					class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
					aria-label="Copy snippet"
				>
					{#if copied}
						<Check class="h-3.5 w-3.5 text-emerald-400" />
						<span class="text-emerald-400">Copied!</span>
					{:else}
						<Copy class="h-3.5 w-3.5" />
						<span>Copy</span>
					{/if}
				</button>
			{/if}
		</div>
	{/if}

	<!-- Code Container -->
	<pre
		class="m-0 flex-1 overflow-auto p-4 font-mono leading-relaxed {wrap
			? 'whitespace-pre-wrap'
			: 'whitespace-pre'}"
		style={maxHeight ? `max-height: ${maxHeight};` : ''}><code class="table w-full border-collapse"
			>{#each tokenizedLines as lineTokens, idx (idx)}{@const lineNum = idx + 1}<div
					class="table-row transition-colors hover:bg-white/3">{#if showLineNumbers}<span
							class="table-cell w-10 pr-4 text-right font-mono text-[11px] text-neutral-600 select-none"
							>{lineNum}</span
						>{/if}<span class="table-cell"
						>{#each lineTokens as token, tIdx (tIdx)}{#if token.type === 'tag'}<span
									class="font-semibold text-rose-400">{token.text}</span
								>{:else if token.type === 'attr-name' || token.type === 'attr'}<span
									class="text-amber-300">{token.text}</span
								>{:else if token.type === 'attr-value' || token.type === 'string'}<span
									class="text-emerald-300">{token.text}</span
								>{:else if token.type === 'merge-var'}<span
									class="inline-block rounded bg-sky-500/20 px-1 text-[11px] font-bold text-sky-300 ring-1 ring-sky-400/40"
									>{token.text}</span
								>{:else if token.type === 'comment'}<span class="text-neutral-500 italic"
									>{token.text}</span
								>{:else if token.type === 'punctuation'}<span class="text-neutral-500"
									>{token.text}</span
								>{:else if token.type === 'keyword'}<span class="font-semibold text-primary-400"
									>{token.text}</span
								>{:else if token.type === 'number'}<span class="text-purple-400">{token.text}</span
								>{:else if token.type === 'macro'}<span class="font-semibold text-indigo-400"
									>{token.text}</span
								>{:else}<span>{token.text}</span>{/if}{/each}</span
					></div>{/each}</code
		></pre>
</div>
