import { listAllUsers } from '$lib/server/lldap';
import { tokens } from '$lib/state.svelte';

export async function load() {
	const users = await listAllUsers(tokens.auth);

	return {
		users
	};
}
