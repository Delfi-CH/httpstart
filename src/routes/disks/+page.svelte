<script lang="ts">
    import axios from "axios";
    import { Data, Disk, DiskType, ParentDisk, Filesystem } from "$lib/data";
    import { onMount } from "svelte";
    import {
        Table,
        Button,
        Container,
        Row,
        Col,
    } from "@sveltestrap/sveltestrap";
    import { resolve } from "$app/paths";
    import DiskEditModal from "$lib/components/DiskEditModal.svelte";

    let serverURL = $state("");
    let data = $state(Data.load());

    let groupedDisks: Array<{
        parent: ParentDisk;
        disks: Array<Disk>;
    }> = $state([]);

    let usedGroupedDisks: Array<Disk> = $state([]);

    let showEditModal = $state(false)
    let editingIndex: number | null = $state(null)
    let currentDisk = $state({})

    onMount(() => {
        const mode = import.meta.env.MODE;

        if (mode === "development") {
            serverURL = "http://localhost:29222";
        }

        data = Data.load();
        usedGroupedDisks = data.disks
    });

    onMount(async () => {
        const tmpdisks = await axios.get(serverURL + "/api/disks");

        const blockdevices = tmpdisks.data.blockdevices;

        groupedDisks = blockdevices
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((d: any) => d.type === "disk")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((disk: any) => {
                const children = flatten(disk.children ?? [])
                    .filter((d) => d.type === "part")
                    .map(
                        (d) =>
                            new Disk(
                                d.name,
                                d.size,
                                determineDiskType(
                                    (d.mountpoints ?? []).filter(Boolean),
                                ),
                                (d.mountpoints ?? []).filter(Boolean),
                                d.fstype ?? Filesystem.null,
                            ),
                    );

                return {
                    parent: new ParentDisk(disk.name, disk.size),
                    disks: children,
                };
            });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function flatten(devices: any[]): any[] {
        return devices.flatMap((d) => [d, ...flatten(d.children ?? [])]);
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

    function startUsingDisk(index: number, parentIndex: number) {
        const disk = groupedDisks[parentIndex].disks[index];

        if (usedGroupedDisks.some((d) => d.name === disk.name)) {
            return;
        }

        usedGroupedDisks = [...usedGroupedDisks, disk];
        data.disks = $state.snapshot(usedGroupedDisks);
        data.save();
    }

    function stopUsingDisk(index: number) {
        usedGroupedDisks = usedGroupedDisks.toSpliced(index, 1)
        data.disks = $state.snapshot(usedGroupedDisks);
        data.save();
    }

    function openEditModal(disk: Disk, index: number) {
        currentDisk = disk
        editingIndex = index
        showEditModal = true
    }
</script>

<main>
    <Container>
        <h1>Disks</h1>
        <Row>
            <Col>
                <h2>Used Disks</h2>
                <h3><a href={resolve("/disks/parts")}>Partition Editor</a></h3>
                <Table size="lg" bordered striped>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Size</th>
                            <th>Filesystem</th>
                            <th>Type</th>
                            <th>Mountpoint</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each usedGroupedDisks as disk, index (disk.name)}
                            <tr>
                                <td>{disk.name}</td>
                                <td>{disk.size}</td>

                                <td>
                                    {disk.filesystem
                                        ? disk.filesystem
                                        : "None/Other"}
                                </td>

                                <td>
                                    {DiskType[
                                        determineDiskType(disk.mountpoints)
                                    ]}
                                </td>

                                <td>
                                    {disk.mountpoints.join(", ")}
                                </td>
                                <td>
                                    <Button onclick={()=> openEditModal(disk, index)}>Edit</Button>
                                    <Button onclick={()=> stopUsingDisk(index)}>Stop Using</Button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </Table>
            </Col>
            <Col>
                <h2>Available Disks</h2>
                {#each groupedDisks as group, parentIndex (group.parent.name)}
                    <div class="mb-4">
                        <h3>
                            Parent Disk: {group.parent.name} ({group.parent
                                .size})
                        </h3>

                        <Table size="lg" bordered striped>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Size</th>
                                    <th>Filesystem</th>
                                    <th>Type</th>
                                    <th>Mountpoint</th>
                                    <th>Use</th>
                                </tr>
                            </thead>

                            <tbody>
                                {#each group.disks as disk, index (disk.name)}
                                    <tr>
                                        <td>{disk.name}</td>
                                        <td>{disk.size}</td>

                                        <td>
                                            {disk.filesystem
                                                ? disk.filesystem
                                                : "None/Other"}
                                        </td>

                                        <td>
                                            {DiskType[
                                                determineDiskType(
                                                    disk.mountpoints,
                                                )
                                            ]}
                                        </td>

                                        <td>
                                            {disk.mountpoints.join(", ")}
                                        </td>

                                        <td>
                                            <Button
                                                onclick={() =>
                                                    startUsingDisk(
                                                        index,
                                                        parentIndex,
                                                    )}
                                                disabled={usedGroupedDisks.some(
                                                    (d) => d.name === disk.name,
                                                )}
                                                >{usedGroupedDisks.some(
                                                    (d) => d.name === disk.name,
                                                )
                                                    ? "Used"
                                                    : "Use"}
                                            </Button>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </Table>
                    </div>
                {/each}
            </Col>
        </Row>
    </Container>
    {#if showEditModal}
    <DiskEditModal open={showEditModal} disk={currentDisk} onClose={()=> showEditModal = false} onSubmit={(disk: Disk)=>{
        showEditModal = false
        if (editingIndex !== null) {
            usedGroupedDisks[editingIndex] = disk

            data.disks = usedGroupedDisks
            data.save()
        }
    }}></DiskEditModal>
    {/if}
</main>
