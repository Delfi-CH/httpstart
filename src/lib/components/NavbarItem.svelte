<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import '@bootstrap-wc/components';

    let { href, content } = $props()
    const currentPage = page.route.id

</script>
<main>
    <bs-nav-item href={resolve(href)} active={href === currentPage}>
        {content}
    </bs-nav-item>
</main>