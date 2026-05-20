<script lang="ts">
    import { Disk, DiskType, Filesystem } from "$lib/data";
    import { Modal, Form, FormGroup, Label, Input, Button } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";

    let { open, onClose, disk, onSubmit } = $props()

    let mountpoints: Array<string> = $state([])
    let filesystem: Filesystem = $state(Filesystem.null)
    let disktype: DiskType = $state(DiskType.any)

    let invalidText = $state("")

    onMount(()=>{
        mountpoints = disk.mountpoints
        filesystem = disk.filesystem
        disktype = disk.type
    })

    function toggle() {
        open = !open
        if (!open) {
            onClose()
        }
    }

    function determineDiskType(mountpoints: Array<string>): DiskType {
        if (mountpoints.includes("/")) {
            return DiskType.root;
        } else if (mountpoints.includes("/home")) {
            return DiskType.home;
        } else if (mountpoints.includes("/boot/efi")) {
            return DiskType.efi;
        } else if (mountpoints.includes("/boot")) {
            return DiskType.boot;
        } else if (mountpoints.includes("[SWAP]")) {
            return DiskType.swap;
        } else if (mountpoints.includes("/tmp")) {
            return DiskType.tmp;
        } else if (mountpoints.includes("/usr")) {
            return DiskType.usr;
        } else if (mountpoints.includes("/var")) {
            return DiskType.var;
        } else {
            return DiskType.any;
        }
    }
    
    function checkIfFsIsDisabled(type: DiskType, fs: Filesystem): boolean {
        if (type === DiskType.root && fs === Filesystem.null) {
            return false
        } else if (type === DiskType.root && fs === Filesystem.fat32) {
            return false
        } else if (type === DiskType.root && fs === Filesystem.swap) {
            return false
        } else if (type === DiskType.home && fs === Filesystem.null) {
            return false
        } else if (type === DiskType.home && fs === Filesystem.fat32) {
            return false
        } else if (type === DiskType.home && fs === Filesystem.swap) {
            return false
        } else if (type === DiskType.efi && fs !== Filesystem.fat32) {
            return false
        } else if (type === DiskType.boot && fs === Filesystem.swap) {
            return false
        } else if (type === DiskType.boot && fs === Filesystem.null) {
            return false
        } else if (type === DiskType.swap && fs !== Filesystem.swap) {
            return false
        } else if (type === DiskType.tmp && fs === Filesystem.null) {
            return false
        } else if (type === DiskType.tmp && fs === Filesystem.fat32) {
            return false
        } else if (type === DiskType.tmp && fs === Filesystem.swap) {
            return false
        } else if (type === DiskType.usr && fs === Filesystem.null) {
            return false
        } else if (type === DiskType.usr && fs === Filesystem.fat32) {
            return false
        } else if (type === DiskType.usr && fs === Filesystem.swap) {
            return false
        } else if (type === DiskType.var && fs === Filesystem.null) {
            return false
        } else if (type === DiskType.var && fs === Filesystem.fat32) {
            return false
        } else if (type === DiskType.var && fs === Filesystem.swap) {
            return false
        } else {
            return true
        }
    }

    $effect(()=>{
        disktype = determineDiskType(mountpoints) 
    })

    function handleSubmit() {
        const d = new Disk(
            disk.name,
            disk.size,
            disktype,
            mountpoints,
            filesystem
        )
        if (checkIfFsIsDisabled(d.type, d.filesystem)) {
            onSubmit(d)
        } else {
            invalidText = `Cannot use filesystem ${d.filesystem} for disk type ${DiskType[d.type]}`
        }
        
    }
</script>

<Modal body header={"Edit " + disk.name} isOpen={open} {toggle}>
    <p>Disk {disk.name}</p>
    <p>Size: {disk.size}</p>
    <p>Type: {DiskType[disktype]}</p>
    <p>Filesystem: {filesystem}</p>
    <Form onsubmit={()=>handleSubmit()}>
        <FormGroup>
            <Label>Edit Mountpoints</Label>
                {#each mountpoints as mountpoint, index (index)}
                    <div class="d-flex gap-2 align-items-center">
                    <Input type="text" onchange={(e)=> mountpoints[index] = e.target.value} bind:value={mountpoints[index]}></Input>
                    <Button onclick={()=> mountpoints = mountpoints.toSpliced(index, 1)}>Delete</Button>
                    </div>
                {/each}
            <Button onclick={()=> mountpoints = [...mountpoints, ""]}>+</Button>
        </FormGroup>
        <FormGroup>
            <Label>Filesystem</Label>
            <Input type="select" bind:value={filesystem}>
                <option>-- Select a filesystem --</option>
                 {#each Object.values(Filesystem) as fs (fs)}
                    <option value={fs} disabled={!checkIfFsIsDisabled(disktype, fs)} selected={filesystem === fs}>{fs}</option>
                 {/each}
            </Input>
        </FormGroup>
        <p>{invalidText}</p>
        <Button type="submit">Save</Button>
    </Form>
</Modal>