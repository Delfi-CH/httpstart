<script lang="ts">
    import { Data, User } from "$lib/data";
    import { onMount } from "svelte";
    import { Input, Table, Button } from "@sveltestrap/sveltestrap"
    import UserEditModal from "$lib/components/UserEditModal.svelte";

    let users: Array<User> = $state([])
    let currentUser = $state({})
    let showEditing = $state(false)
    let hostname = $state("")
    let hostnameIsValid: boolean = $state(true)
    onMount(()=>{
        const data = Data.load()
        users = data.users
        hostname = data.hostname
        if (users.length < 1) {
            users = [...users, new User("root", "", true, false)]
        }
        data.users = users
        data.save()
        console.log(users)
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function validateUser(obj: any) {
        if (
            obj.username !== "" &&
            obj.password !== ""
        ) {return true} else {
            return false
        }
    }

    $effect(()=>{
        const data = Data.load()
        data.users = users
        data.hostname = hostname
        data.save()
    })
</script>
<main>
    <h1>Users & Hostname</h1>
    <h2>Users</h2>
    <Button color="success" onclick={()=>{
        currentUser = new User("", "", false, false)
        showEditing = true
    }}>New User</Button>
    {#if !users.some((x)=> x.username === "root")}
        <Button color="warning" onclick={()=> {users = [...users, new User("root", "", true, false)]}}>Add root user</Button>
    {/if}
    <Table size="lg" bordered striped>
        <thead>
            <tr>
                <th>#</th>
                <th>Username</th>
                <th>Password set?</th>
                <th>Superuser?</th>
                <th>SSH login?</th>
                <th>Operations</th>
            </tr>
        </thead>
        <tbody>
            {#each users as user, index (index) }
                <tr>
                    <th scope="row">{index}</th>
                    <td>{user.username}</td>
                    <td>{user.password === "" ? "No" :  "Yes"}</td>
                    <td>{user.sudo ? "Yes" : "No"}</td>
                    <td>{user.ssh ? "Yes" : "No"}</td>
                    <td>
                        <Button color="dark" onclick={()=>{
                            currentUser = user
                            showEditing = true
                        }}>Edit</Button>
                        <Button color="danger" disabled={user.username === "root"} onclick={()=>{
                            users = users.filter((x)=> x.username !== user.username)
                        }}>Delete</Button>
                        {#if user.username === "root"}
                            <Button color="warning" onclick={()=>{
                                if (users.length <= 1) {
                                    console.log("nuhuh")
                                } else {
                                    users = users.filter((x)=> x.username !== "root")
                                }
                            }}>Disable root</Button>
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </Table>
    {#if showEditing}
        <UserEditModal open={showEditing} data={currentUser} onSubmit={(data2: User)=>{
            showEditing=false
            console.log(data2)
            if (validateUser(data2)) {
                users = [...users, data2]
            }
        }} onClose={()=> showEditing=false}>

        </UserEditModal>
    {/if}
    <h3>Hostname</h3>
    <Input type="text" oninput={handleHostnameChange} bind:value={hostname} placeholder="e.g. ubuntu-server" valid={hostnameIsValid}></Input>
</main>