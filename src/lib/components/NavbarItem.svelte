<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import { NavItem, NavLink } from '@sveltestrap/sveltestrap';

    let { href, content } = $props()
    const isActive = $derived(page.route.id === href)

</script>
<main>
    <NavItem active={isActive}>
        <NavLink href={resolve(href)} active={isActive} class={isActive ? 'bg-dark text-white' : 'text-light'}>{content}</NavLink>
    </NavItem>
</main>