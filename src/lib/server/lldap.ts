import { LLDAP_URL, LLDAP_ADMIN_NAME, LLDAP_ADMIN_PASSWORD } from '$env/static/private';
import urlJoin from 'url-join';

const LLDAP_LOGIN_ENDPOINT = urlJoin(LLDAP_URL, 'auth/simple/login');
const LLDAP_REFRESH_ENDPOINT = urlJoin(LLDAP_URL, 'auth/refresh');
const LLDAP_GRAPHQL_ENDPOINT = urlJoin(LLDAP_URL, 'api/graphql');

export async function getTokens() {
	const response = await fetch(LLDAP_LOGIN_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: LLDAP_ADMIN_NAME,
			password: LLDAP_ADMIN_PASSWORD
		})
	});

	if (!response.ok) {
		throw new Error('Failed to fetch token');
	}

	return await response.json();
}

export async function refreshToken(token: string) {
	const response = await fetch(LLDAP_REFRESH_ENDPOINT, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Cookie: `refresh_token=${token}`
		}
	});

	if (!response.ok) {
		throw new Error('Failed to refresh token');
	}

	const data = await response.json();
	return data.token;
}

export async function listAllUsers(token: string) {
	const response = await fetch(LLDAP_GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			query: `
				query {
					users {
						id
						email
						displayName
						firstName
						lastName
						groups {
							id
							displayName
						}
					}
				}
			`
		})
	});

	if (!response.ok) {
		throw new Error('Failed to fetch users');
	}

	const data = await response.json();
	return data.data.users;
}
