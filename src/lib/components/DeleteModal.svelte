<script lang="ts">
    import { Modal, Button } from "@sveltestrap/sveltestrap";

    let { open, onClose, item } = $props()

    function toggle() {
        open = !open
        if (!open) {
            onClose(false)
        }
    }
</script>

<Modal body header="Warning" isOpen={open} {toggle}>
    <p class="text-danger">This will delete {item} !</p>
    <p class="text-danger">Are you sure?</p>
    <Button color="danger" onclick={()=> {
        open = !open
        onClose(true)
    }}>Confirm</Button>
</Modal>