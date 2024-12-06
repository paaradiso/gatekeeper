import { getTokens, refreshToken, getUserById } from '$lib/server/lldap';
import { tokens as tokensClass } from '$lib/state.svelte';

const tokens = await getTokens();

tokensClass.refresh = tokens.refreshToken;
tokensClass.auth = tokens.token;

console.log(await getUserById(tokensClass.auth, 'andrei'));
