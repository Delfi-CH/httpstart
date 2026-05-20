import { PackageRepository } from "$lib/data";

export function getRepos_Archlinux() {
    const repoList: Array<PackageRepository> = [
        new PackageRepository("Core", "https://archlinux.org/packages/Core/x86_64/", true),
        new PackageRepository("Extra", "https://archlinux.org/packages/Extra/x86_64/", true),
        new PackageRepository("Multilib", "https://archlinux.org/packages/multilib/x86_64/", false)
    ] 
    return repoList
}