<script lang="ts">
    import NavbarItem from './NavbarItem.svelte';
    import { Nav } from '@sveltestrap/sveltestrap';
</script>

<main>
    <Nav class="bg-primary p-2" theme="dark" pills={true} color="dark">
        <NavbarItem href="/" content="Overview"></NavbarItem>
        <NavbarItem href="/lang" content="Language"></NavbarItem>
        <NavbarItem href="/timezone" content="Location & Timezone"></NavbarItem>
        <NavbarItem href="/packages" content="Additional Software"></NavbarItem>
        <NavbarItem href="/disks" content="Disks"></NavbarItem>
        <NavbarItem href="/users" content="Users & Hostname"></NavbarItem>
        <NavbarItem href="/shell" content="Terminal"></NavbarItem>
        <NavbarItem href="/about" content="About"></NavbarItem>
    </Nav>
</main>