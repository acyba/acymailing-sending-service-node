const API_URL = 'https://api.acymailer.com';

export class ApiService {
    private readonly apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private buildHeaders = (method: string): { [key: string]: string } => {
        return {
            'API-KEY': this.apiKey,
            'Content-Type': method === 'PATCH' ? 'application/merge-patch+json' : 'application/json',
            Version: 'external',
        }
    }

    public request = async (uri: string, method: string = 'GET', body: any = {}): Promise<any> => {
        const url: string = `${API_URL}${uri}`;

        const fetchOptions: RequestInit = {
            method: method,
            headers: this.buildHeaders(method),
        }

        if (Object.keys(body).length > 0) {
            fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);

        if (response.status >= 200 && response.status < 300) {
            if (response.headers.get('content-type') === 'application/json') {
                return response.json();
            }

            return {};
        }

        if (response.status >= 400) {
            const error = await response.json();
            throw new Error(error.message);
        }
    }
}
