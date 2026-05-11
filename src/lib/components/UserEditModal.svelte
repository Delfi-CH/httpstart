<script lang="ts">
    import {Modal, Form, Input, Label, Button, FormGroup} from "@sveltestrap/sveltestrap"
    import { onMount } from "svelte";
    let {open, data, onSubmit, onClose} = $props()

    let localData = $derived(data);

    onMount(()=>{
        console.log(localData.username)
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
</script>

<Modal body header={data.username === "" ? "New User" : "Edit user "+data.username} isOpen={open} {toggle}>
    <Form onsubmit={()=>onSubmit(data)}>
    <FormGroup>
        <Label for="username">Username</Label>
        <Input bind:value={localData.username} id="username" type="text" disabled={data.username === "root"}></Input>
    </FormGroup>
    <FormGroup>
        <Label for="password">Password</Label>
        <Input bind:value={localData.password} id="password" type="password"></Input>
        </FormGroup>
        <FormGroup>
        <Label for="superuser">
            Has superuser privileges?
            <Input bind:checked={localData.root} id="superuser" type="switch" disabled={data.username === "root"}   ></Input>
        </Label>
        </FormGroup>
        <FormGroup>
        <Label for="ssh">
            Allow login via ssh?
            <Input bind:checked={localData.ssh} id="ssh" type="switch" disabled={data.username === "root"}></Input>
        </Label>
        </FormGroup>
        <Button type="submit" color="dark">Save</Button>
    </Form>
</Modal>