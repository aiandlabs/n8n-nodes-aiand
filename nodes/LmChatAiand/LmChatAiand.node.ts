import type {
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	ISupplyDataFunctions,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { supplyModel } from '@n8n/ai-node-sdk';

const BASE_URL = 'https://api.aiand.com/v1';

type ModelOptions = {
	reasoningEffort?: string;
	temperature?: number;
	maxTokens?: number;
};

type AiandModel = {
	id: string;
	reasoning_efforts?: string[];
	reasoning_effort_default?: string;
};

export class LmChatAiand implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ai& Chat Model',
		name: 'lmChatAiand',
		icon: { light: 'file:../../icons/aiand.svg', dark: 'file:../../icons/aiand.dark.svg' },
		group: ['transform'],
		subtitle: '={{$parameter["model"]}}',
		version: [1],
		description: 'Use open-weight chat models served by ai& from Japan',
		defaults: {
			name: 'ai& Chat Model',
		},
		codex: {
			categories: ['assistant'],
			subcategories: {
				AI: ['Language Models', 'Root Nodes'],
				'Language Models': ['Chat Models (Recommended)'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://github.com/aiandlabs/n8n-nodes-aiand#readme',
					},
				],
			},
		},
		inputs: [],
		outputs: [NodeConnectionTypes.AiLanguageModel],
		outputNames: ['Model'],
		credentials: [
			{
				name: 'aiandApi',
				required: true,
			},
		],
		requestDefaults: {
			ignoreHttpStatusErrors: true,
			baseURL: BASE_URL,
		},
		properties: [
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				description:
					'The model to use. Choose from the list, or specify a model ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptions: {
						routing: {
							request: {
								method: 'GET',
								url: '/models',
							},
							output: {
								postReceive: [
									{ type: 'rootProperty', properties: { property: 'data' } },
									// A model with a deprecation date is being retired, so new workflows should not
									// pick it. Live data: future retirements need no node release.
									{
										type: 'filter',
										properties: { pass: '={{ !$responseItem.deprecation_date }}' },
									},
									{
										type: 'setKeyValue',
										properties: {
											name: '={{$responseItem.id}}',
											value: '={{$responseItem.id}}',
											description: '={{$responseItem.description}}',
										},
									},
									{ type: 'sort', properties: { key: 'name' } },
								],
							},
						},
					},
				},
				default: 'deepseek-ai/deepseek-v4.1-flash',
			},
			{
				displayName: 'Options',
				name: 'options',
				placeholder: 'Add Option',
				description: 'Additional options to add',
				type: 'collection',
				default: {},
				options: [
					{
						displayName: 'Maximum Tokens',
						name: 'maxTokens',
						default: 4096,
						typeOptions: { minValue: 1 },
						description: 'The maximum number of tokens to generate in the response',
						type: 'number',
					},
					{
						displayName: 'Reasoning Effort Name or ID',
						name: 'reasoningEffort',
						type: 'options',
						default: '',
						typeOptions: {
							loadOptionsMethod: 'getReasoningEfforts',
							loadOptionsDependsOn: ['model'],
						},
						description:
							'How much the model thinks before answering. The levels differ by model. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Sampling Temperature',
						name: 'temperature',
						default: 0.7,
						typeOptions: { maxValue: 2, minValue: 0, numberPrecision: 1 },
						description:
							'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.',
						type: 'number',
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			// Each model publishes its own levels (some go up to max or xhigh), so the list
			// comes from the catalog rather than a fixed low/medium/high.
			async getReasoningEfforts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const modelId = this.getCurrentNodeParameter('model') as string;
				const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'aiandApi', {
					method: 'GET',
					url: `${BASE_URL}/models`,
					json: true,
				})) as { data: AiandModel[] };
				const model = response.data.find((m) => m.id === modelId);
				const levels = model?.reasoning_efforts ?? [];
				const fallback = model?.reasoning_effort_default;
				return [
					{ name: fallback ? `Model Default (${fallback})` : 'Model Default', value: '' },
					...levels.map((level) => ({ name: level, value: level })),
				];
			},
		},
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number) {
		const credentials = await this.getCredentials('aiandApi');
		const model = this.getNodeParameter('model', itemIndex) as string;
		const options = this.getNodeParameter('options', itemIndex, {}) as ModelOptions;

		return supplyModel(this, {
			type: 'openai',
			baseUrl: BASE_URL,
			apiKey: credentials.apiKey as string,
			model,
			temperature: options.temperature,
			maxTokens: options.maxTokens,
			// Passed as a raw body field: the SDK's typed `reasoning.effort` stops at `high`,
			// and ai& models also accept `max` and `xhigh`.
			additionalParams: options.reasoningEffort
				? { reasoning_effort: options.reasoningEffort }
				: undefined,
		});
	}
}
