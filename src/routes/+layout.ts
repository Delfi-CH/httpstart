export const ssr = false
export const prerender = true

import axios from 'axios'

export async function load() {
    const mode = import.meta.env.MODE;

	let serverURL = "/"
	if (mode === "development") {
        serverURL = "http://localhost:29222";
    }

	const distro = (await axios.get(serverURL +'/api/distro')).data

	return {
		distro
	}
}