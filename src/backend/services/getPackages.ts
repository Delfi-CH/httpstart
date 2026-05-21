import { Distribution } from "../../lib/data";
import { getPackageGroups_ArchLinux, getRepos_ArchLinux } from "./archlinux/packages";
import { getDistibution } from "./getDistro";

export function getRepos() {
    const distro = getDistibution()

    switch (distro) {
        case Distribution.ArchLinux: return getRepos_ArchLinux()
        default: return []
    }
}

export function getPackageGroups() {
    const distro = getDistibution()

    switch (distro) {
        case Distribution.ArchLinux: return getPackageGroups_ArchLinux()
        default: return []
    }
}