<script lang="ts">
    import {Modal, Form, Input, Label, Button, FormGroup} from "@sveltestrap/sveltestrap"
    import { onMount } from "svelte";
    let {open, data, onSubmit, onClose} = $props()

    let localData = $derived(data);
    let errorMsg = $state("")

    onMount(()=>{
        if (localData.username === "root") {
            localData.ssh = false
            localData.root = true
        }
    })

    const toggle = () => {
        open =!open
        if (!open) {
            onClose()
        }
    }

    function handleSubmit() {
        console.log("submit")
        console.log($state.snapshot(localData))
        const regex =
            /^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)(\.([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*))*$/;

        if (!regex.test(localData.username)) {
            errorMsg = "Invalid Username!"
        } else {
            onSubmit(localData)
            errorMsg = ""
        }
    }
</script>

<Modal body header={data.username === "" ? "New User" : "Edit user "+data.username} isOpen={open} {toggle}>
    <Form onsubmit={()=>handleSubmit()}>
    <FormGroup>
        <Label for="username">Username</Label>
        <Input bind:value={localData.username} id="username" type="text" disabled={data.username === "root"} placeholder="e.g server" required></Input>
    </FormGroup>
    <FormGroup>
        <Label for="password">Password</Label>
        <Input bind:value={localData.password} id="password" type="password" required></Input>
        </FormGroup>
        <FormGroup>
        <Label for="superuser">
            Has superuser privileges?
            <Input bind:checked={localData.root} id="superuser" type="switch" disabled={data.username === "root"}></Input>
        </Label>
        </FormGroup>
        <FormGroup>
        <Label for="ssh">
            Allow login via ssh?
            <Input bind:checked={localData.ssh} id="ssh" type="switch" disabled={data.username === "root"}></Input>
        </Label>
        </FormGroup>
        <Button type="submit" color="dark">Save</Button>
        <p class="text-danger">{errorMsg}</p>
    </Form>
</Modal>