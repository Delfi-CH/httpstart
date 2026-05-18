<script lang="ts">
    import { Modal } from "@sveltestrap/sveltestrap";

    let { open, message, onClose } = $props()

    function toggle() {
        open = !open
        if (!open) {
            onClose()
        }
    }
</script>

<Modal body header="Alert" isOpen={open} {toggle}>
    {message}
</Modal>