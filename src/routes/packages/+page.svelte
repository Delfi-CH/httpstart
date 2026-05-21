<script lang="ts">
    import {
        Distribution,
        PackageGroup,
        PackageRepository,
        Data,
        DistroPackageQueryUrl,
    } from "$lib/data";
    import {
        Container,
        Row,
        Col,
        Label,
        Input,
        Form,
        FormGroup,
        Card,
        CardBody,
        CardHeader,
        CardTitle,
        Button,
        Popover,
    } from "@sveltestrap/sveltestrap";
    import DeleteModal from "$lib/components/DeleteModal.svelte";
    import axios from "axios";
    import { onMount } from "svelte";

    let serverURL = $state("");
    let packages: Array<string> = $state([]);
    let groups: Array<PackageGroup> = $state([]);
    let repos: Array<PackageRepository> = $state([]);
    let disto = $state(Distribution.Other);
    const queryUrlBase = () => {
        switch (disto) {
            case Distribution.ArchLinux:
                return DistroPackageQueryUrl.ArchLinux;
            default:
                return "/";
        }
    };

    let queryResult: Array<{
        name: string;
        repo: string;
    }> = $state([]);
    let queryStatus = $state(false);
    let data = $state(Data.load());

    let searchTerm = $state("");
    let showDeleteModal = $state(false)
    let deleteModalItem = $state("")

    onMount(() => {
        const mode = import.meta.env.MODE;
        if (mode === "development") {
            serverURL = "http://localhost:29222";
        }

        data = Data.load();
        packages = data.packages;
    });

    onMount(async () => {
        const tmpDistro = await axios.get(serverURL + "/api/distro");
        disto = tmpDistro.data.distro;
        const tmpRepos = await axios.get(serverURL + "/api/pkg/repos");
        repos = tmpRepos.data;
        const tmpGroups = await axios.get(serverURL + "/api/pkg/groups");
        groups = tmpGroups.data;
        for (let group of groups) {
            if (
                group.packages.some((p) => packages.includes(p)) &&
                !group.enabled
            ) {
                group.enabled = true;
            }
            onGroupChange(group);
        }
    });

    function onGroupChange(group: PackageGroup) {
        if (
            group.enabled &&
            !packages.some((p) => group.packages.includes(p))
        ) {
            packages = [...packages, ...group.packages];
            data.packages = packages;
            data.save();
        } else if (
            !group.enabled &&
            packages.some((p) => group.packages.includes(p))
        ) {
            packages = packages.filter((p) => !group.packages.includes(p));
            data.packages = packages;
            data.save();
        }
    }

    function triggerDeleteModal(item: string) {
        deleteModalItem = item
        showDeleteModal = true
    }
</script>

<main>
    <Container>
        <h1>Additional Software</h1>
        <Row>
            <Col>
                <Form>
                    <Card>
                        <CardHeader>
                            <CardTitle>Selected Packages</CardTitle>
                        </CardHeader>
                        <CardBody>
                            {#each packages as pkg, index (index)}
                                <span id={"package-"+index}>{pkg}</span>
                                <Popover target={"package-"+index} placement="top" trigger="click" hideOnOutsideClick hidden={showDeleteModal}><Button color="warning" onclick={()=> triggerDeleteModal(pkg)}>Remove {pkg}</Button></Popover>
                            {/each}
                        </CardBody>
                        {#if showDeleteModal}
                        <DeleteModal open={showDeleteModal} item={deleteModalItem} onClose={(confirmDelete: boolean)=>{
                            showDeleteModal = false
                            if (confirmDelete) {
                                packages = packages.toSpliced(packages.indexOf(deleteModalItem), 1)
                                data.packages = packages;
                                data.save();
                            }
                        }}></DeleteModal>
                        {/if}
                    </Card>
                    <FormGroup>
                        <div class="d-flex gap-2 align-items-center">
                            <h3>Groups</h3>
                            {#if groups.some((g) => g.enabled == false)}
                                <Button
                                    onclick={() => {
                                        groups.forEach((g) => {
                                            if (g.allowDisable) {
                                                g.enabled = true;
                                            }
                                            onGroupChange(g);
                                        });
                                    }}>Select All</Button
                                >
                            {:else}
                                <Button
                                    onclick={() => {
                                        groups.forEach((g) => {
                                            if (g.allowDisable) {
                                                g.enabled = false;
                                            }
                                            onGroupChange(g);
                                        });
                                    }}>Deselect All</Button
                                >
                            {/if}
                        </div>
                        <Container>
                            <Row>
                                {#each groups as group (group.name)}
                                    <Col md="3"
                                        ><div
                                            class="d-flex gap-2 align-items-center"
                                        >
                                            <Input
                                                type="checkbox"
                                                bind:checked={group.enabled}
                                                disabled={!group.allowDisable}
                                                onchange={() =>
                                                    onGroupChange(group)}
                                            ></Input><Label
                                                ><h5>{group.name}</h5>
                                                {group.desc}</Label
                                            >
                                        </div></Col
                                    >
                                {/each}
                            </Row>
                        </Container>
                    </FormGroup>
                    <FormGroup>
                        <h3>Search for packages</h3>
                        <Form
                            onsubmit={async (e) => {
                                e.preventDefault();
                                queryStatus = true;

                                let queryUrl =
                                    queryUrlBase() +
                                    "?q=" +
                                    searchTerm +
                                    "&repo=" +
                                    repos
                                        .filter((r) => r.enabled)
                                        .map((r) => r.name)
                                        .join("&repo=");
                                const result = await axios.post(
                                    serverURL + "/api/pkg/query/",
                                    { queryUrl: queryUrl },
                                );
                                queryResult = result.data;
                                queryStatus = false;
                            }}
                            class="w-50"
                        >   
                            <div class="d-flex gap-2 align-items-center">
                                <Input
                                    type="text"
                                    bind:value={searchTerm}
                                    placeholder="e.g. tmux"
                                    required
                                ></Input><Button
                                    type="submit"
                                    disabled={queryStatus}
                                    >{queryStatus
                                        ? "Searching..."
                                        : "Search"}</Button
                                >
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Found Packages:</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    {#if queryResult.length >= 1}
                                        {#each queryResult as pkg, i (i)}
                                            <div
                                                class="d-flex gap-2 align-items-center"
                                            >
                                                <p>{pkg.name} ({pkg.repo})</p>
                                                <Button
                                                    disabled={packages.includes(
                                                        pkg.name,
                                                    )}
                                                    onclick={() => {
                                                        if (
                                                            !packages.includes(
                                                                pkg.name,
                                                            )
                                                        ) {
                                                            packages = [
                                                                ...packages,
                                                                pkg.name,
                                                            ];
                                                            data.packages =
                                                                packages;
                                                            data.save();
                                                        }
                                                    }}
                                                    >{!packages.includes(
                                                        pkg.name,
                                                    )
                                                        ? "Add"
                                                        : "Added."}</Button
                                                >
                                            </div>
                                        {/each}
                                    {:else}
                                        <p>No packages found.</p>
                                    {/if}
                                </CardBody>
                            </Card>
                        </Form>
                    </FormGroup>
                    <FormGroup>
                        <h3>Repositories</h3>
                        {#each repos as repo (repo.name)}
                            <div class="d-flex gap-2 align-items-center">
                                <Input
                                    type="checkbox"
                                    bind:checked={repo.enabled}
                                    disabled={!repo.allowDisable}
                                ></Input><Label
                                    ><h4>{repo.name}</h4>
                                    {repo.description}</Label
                                >
                            </div>
                        {/each}
                    </FormGroup>
                </Form>
            </Col>
        </Row>
    </Container>
</main>
