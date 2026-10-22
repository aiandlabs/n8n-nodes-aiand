import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class AiandApi implements ICredentialType {
	name = 'aiandApi';

	displayName = 'Ai& API';

	icon: Icon = { light: 'file:../icons/aiand.svg', dark: 'file:../icons/aiand.dark.svg' };

	documentationUrl = 'https://github.com/aiandlabs/n8n-nodes-aiand#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Your ai& API key (starts with sk-). Create one at https://aiand.com.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	// The model list is public, but it rejects an invalid key, so it doubles as the key check.
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.aiand.com/v1',
			url: '/models',
		},
	};
}
