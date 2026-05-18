<script lang="ts">
    import { Container, Row, Col } from "@sveltestrap/sveltestrap";
    import { Distribution, httpstartVersion } from "$lib/data";
    import { onMount } from "svelte";
    import axios from "axios";

    let distro = $state(Distribution.Other);
    const currentDate = new Date();

    onMount(async () => {
        const mode = import.meta.env.MODE;

        let serverURL = "/";
        if (mode === "development") {
            serverURL = "http://localhost:29222";
        }

        const tmpDistro = (await axios.get(serverURL + "/api/distro")).data;
        distro = tmpDistro.distro;
    });
</script>

<main>
    <Container>
        <h1>About this Software</h1>
        <Row>
            <Col>
                <p>
                    {distro} Network Installer via
                    <a
                        href="https://github.com/Delfi-CH/httpstart"
                        target="_blank"
                        class="text-white">httpstart</a
                    >
                    v{httpstartVersion}
                </p>
                <br />
                <p>
                    <a
                        href="https://github.com/Delfi-CH/httpstart"
                        target="_blank"
                        class="text-white">httpstart</a
                    >
                    is a project of Delfi-CH
                    <a href="https://delfi.dev" target="_blank"
                        >(https://delfi.dev)</a
                    >
                </p>
                <br/>
                <p>© Delfi-CH 2026-{currentDate.getFullYear()}</p>
                <p>
                    This program is free software: you can redistribute it
                    and/or modify it under the terms of the GNU General Public
                    License as published by the Free Software Foundation, either
                    version 3 of the License, or (at your option) any later
                    version.
                </p>
                <p>
                    This program is distributed in the hope that it will be
                    useful, but WITHOUT ANY WARRANTY; without even the implied
                    warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
                    PURPOSE. See the GNU General Public License for more
                    details.
                </p>
                <p>
                    You should have received a copy of the GNU General Public
                    License along with this program. If not, see <a
                        href="https://www.gnu.org/licenses/"
                        >https://www.gnu.org/licenses/</a
                    >.
                </p>
            </Col>
        </Row>
    </Container>
</main>
