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

    let serverURL = $state("");
    let data = $state(Data.load());

    let groupedDisks: Array<{
        parent: ParentDisk;
        disks: Array<Disk>;
    }> = $state([]);

    onMount(() => {
        const mode = import.meta.env.MODE;

        if (mode === "development") {
            serverURL = "http://localhost:29222";
        }

        data = Data.load();
    });

    onMount(async () => {
        const tmpdisks = await axios.get(serverURL + "/api/disks");

        const blockdevices = tmpdisks.data.blockdevices;

        groupedDisks = blockdevices
            .filter((d) => d.type === "disk")
            .map((disk) => {
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
                                d.fstype ?? Filesystem.none,
                            ),
                    );

                return {
                    parent: new ParentDisk(disk.name, disk.size),
                    disks: children,
                };
            });
    });

    function flatten(devices: any[]): any[] {
        return devices.flatMap((d) => [d, ...flatten(d.children ?? [])]);
    }

    function determineDiskType(mountpoints: Array<string>): DiskType {
        if (mountpoints.includes("/")) {
            return DiskType.root;
        } else if (mountpoints.includes("/home")) {
            return DiskType.home;
        } else if (mountpoints.includes("/boot")) {
            return DiskType.boot;
        } else if (mountpoints.includes("/boot/efi")) {
            return DiskType.efi;
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
</script>

<main>
    <Container>
        <h1>Disks</h1>
        <Row>
            <Col>
                <h2>Used Disks</h2>
            </Col>
            <Col>
                <h2>Available Disks</h2>
                {#each groupedDisks as group (group.parent.name)}
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
                                    <th>Mountpoints</th>
                                    <th>Operations</th>
                                </tr>
                            </thead>

                            <tbody>
                                {#each group.disks as disk (disk.name)}
                                    <tr>
                                        <td>{disk.name}</td>
                                        <td>{disk.size}</td>

                                        <td>
                                            {disk.filesystem
                                                ? disk.filesystem
                                                : "None"}
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
                                            <Button>Edit</Button>
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
</main>
