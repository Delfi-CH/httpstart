<script lang="ts">
    import { Container, Row, Col, Button } from "@sveltestrap/sveltestrap";
    import { Data, User, Disk, DiskType, Distribution } from "$lib/data";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";

    let data = $state(Data.load());

    let allIsOk = $state(false);
    let userValidationErrorMsg = $state("");
    let diskValidationWarnMsg = $state("");
    let diskValidationErrorMsg = $state("");

    onMount(() => {
        data = Data.load();
    });

    $effect(() => {
        let check1 = !(
            data.language === "-- Select a Language --" ||
            data.language === undefined ||
            data.language === null ||
            data.language === ""
        );
        let check2 = !(
            data.timezone === undefined ||
            data.timezone === null ||
            data.timezone === ""
        );
        let check3 = validatePackages($state.snapshot(data.packages));
        let check4 = validateDisks($state.snapshot(data.disks));
        let check5a = validateUsers($state.snapshot(data.users));
        let check5b = !(
            data.hostname === undefined ||
            data.hostname === null ||
            data.hostname === ""
        );
        if (check1 && check2 && check3 && check4 && check5a && check5b) {
            allIsOk = true;
        } else {
            allIsOk = false;
        }
    });

    function validateUsers(users: Array<User>): boolean {
        if (users.length < 1) {
            userValidationErrorMsg = "No users created!";
            return false;
        }
        const e = users.map(validateSingleUser);
        if (e.includes(false)) {
            userValidationErrorMsg = "Username or passwords missing!";
            return false;
        }

        if (users.length === 1 && users[0].username === "root") {
            userValidationErrorMsg =
                "The root account cannot be the only account!";
            return false;
        }
        userValidationErrorMsg = "";
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function validateSingleUser(obj: any) {
        if (obj.username !== "" && obj.password !== "") {
            return true;
        } else {
            return false;
        }
    }

    function validateDisks(disks: Array<Disk>) {
        if (!disks.some((d) => d.type == DiskType.root)) {
            diskValidationWarnMsg = "";
            diskValidationErrorMsg = "No root Partition set!";
            return false;
        } else if (!disks.some((d) => d.type == DiskType.efi)) {
            diskValidationWarnMsg = "No EFI Boot Partition set!";
            return true;
        } else if (!disks.some((d) => d.type == DiskType.swap)) {
            diskValidationWarnMsg = "No SWAP Partition set!";
            return true;
        } else if (!disks.some((d) => d.type == DiskType.home)) {
            diskValidationWarnMsg = "No Home Partition set!";
            return true;
        } else {
            diskValidationErrorMsg = "";
            return true;
        }
    }

    function validatePackages(packages: Array<string>): boolean {
        switch (data.distro) {
            case Distribution.ArchLinux:
                return (
                    packages.length >= 3 &&
                    packages.includes("base") &&
                    packages.includes("linux-firmware") &&
                    packages.includes("linux")
                );
            default:
                return false;
        }
    }
</script>

<main>
    <Container>
        <h1>Final Overview</h1>
        <Row>
            <Col>
                <h2>Selected Values</h2>
                <h5>Language: {data.language}</h5>
                <h5>Timezone: {data.timezone}</h5>
                <h5>
                    Additional Software: Selected {data.packages.length} Packages
                </h5>
                <p>{data.packages.join(", ")}</p>
                <h5>Disks:</h5>
                {#each data.disks as disk, index (index)}
                    <p>
                        {disk.name}, {disk.filesystem} ({disk.mountpoints.join(
                            ",",
                        )})
                    </p>
                {/each}
                <h5>Users</h5>
                {#each data.users as user, index (index)}
                    <p>{user.username}</p>
                {/each}
                <h5>Hostname</h5>
                <p>{data.hostname}</p>
            </Col>
            <Col>
                <h2>Warnings/Errors</h2>
                {#if userValidationErrorMsg !== ""}<p class="text-danger">Users/Hostname: {userValidationErrorMsg}</p>{/if}
                {#if diskValidationErrorMsg !== ""}<p class="text-danger">Disks: {diskValidationErrorMsg}</p>{/if}
                {#if diskValidationWarnMsg !== ""}<p class="text-warning">Disks: {diskValidationWarnMsg}</p>{/if}
                {#if allIsOk}<h4 class="text-success">No errors found!</h4>{/if}
            </Col>
        </Row>
        <Row>
            <Col>
                <Button color="danger" size="lg" disabled={!allIsOk} onclick={()=>{
                    goto(resolve("/install/progress"))
                }}>Start Installation</Button>
            </Col>
        </Row>
    </Container>
</main>
