import axios from 'axios';

export async function mergeSwaggerDocs(): Promise<any> {

    const authUrl = process.env.AUTH_SERVICE_URL || 'http://auth-server:3001';
    const eventUrl = process.env.EVENT_SERVICE_URL || 'http://event-server:3002';

    const [authDoc, eventDoc] = await Promise.all([
        axios.get(`${authUrl}/api-json`),
        axios.get(`${eventUrl}/api-json`),
    ]);

    console.log('[Merged Swagger Paths]', Object.keys({
        ...authDoc.data.paths,
        ...eventDoc.data.paths,
    }));

    return {
        openapi: '3.0.0',
        info: {
            title: 'Unified API Docs',
            description: 'Auth + Event API 통합 Swagger 문서',
            version: '1.0',
        },
        paths: {
            ...authDoc.data.paths,
            ...eventDoc.data.paths,
        },
        components: {
            schemas: {
                ...authDoc.data.components?.schemas,
                ...eventDoc.data.components?.schemas,
            },
            securitySchemes: {
                ...authDoc.data.components?.securitySchemes,
                ...eventDoc.data.components?.securitySchemes,
            },
        },

        tags: [
            ...(authDoc.data.tags || []),
            ...(eventDoc.data.tags || []),
        ],
    };
}
