import { Distribution } from "$lib/data";
import { getRepos_Archlinux } from "./archlinux/packages";
import { getDistibution } from "./getDistro";

export function getRepos() {
    const distro = getDistibution()

    switch (distro) {
        case Distribution.ArchLinux: return getRepos_Archlinux()
        default: return []
    }
}