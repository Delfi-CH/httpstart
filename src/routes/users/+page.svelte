<script lang="ts">
    import { Data, User } from "$lib/data";
    import { onMount } from "svelte";
    import '@bootstrap-wc/components';

    let users: Array<User> = $state([])
    let hostname = $state("")
    let hostnameIsValid: boolean = $state(true)
    onMount(()=>{
        const data = Data.load()
        users = data.users
        hostname = data.hostname
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleHostnameChange(e:any) {
        const regex = /^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)(\.([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*))*$/
        hostnameIsValid = regex.test(e.target.value)
        if (hostnameIsValid) {
            hostname = String(e.target.value)
            const data = Data.load()
            data.hostname = hostname
            data.save()
        }
    }
</script>
<main>
    <h1>users & hostname</h1>
    <h2>Users</h2>
    <h3>Hostname</h3>
    <bs-input type="text" oninput={handleHostnameChange} value="" placeholder="e.g. ubuntu-server" valid={hostnameIsValid}></bs-input>
</main>