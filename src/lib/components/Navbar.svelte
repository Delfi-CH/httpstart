<script lang="ts">
    import '@bootstrap-wc/components';
    import NavbarItem from './NavbarItem.svelte';

</script>

<main>
    <bs-nav class="bg-primary p-1" data-bs-theme="dark" nav-style="pills">
        <NavbarItem href="/" content="Overview"></NavbarItem>
        <NavbarItem href="/lang" content="Language"></NavbarItem>
        <NavbarItem href="/timezone" content="Location & Timezone"></NavbarItem>
        <NavbarItem href="/disks" content="Disks"></NavbarItem>
        <NavbarItem href="/packages" content="Additional Software"></NavbarItem>
        <NavbarItem href="/users" content="Users"></NavbarItem>
    </bs-nav>
</main>