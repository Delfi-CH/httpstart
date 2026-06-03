import { PackageRepository, PackageGroup } from "../../../lib/data";
import axios from "axios";

const repoCore = new PackageRepository("Core", "Contains all Packages required for installing and running Arch Linux (e.g. the Linux Kernel, pacman, coreutils).", "https://archlinux.org/packages/Core/", true, false)
const repoExtra = new PackageRepository("Extra", "Contains Software that is not strictly required for running Arch Linux (e.g. Graphical Interfaces, Webbrowsers, most apps).", "https://archlinux.org/packages/Extra/", true, false)
const repoMultilib = new PackageRepository("Multilib", "Contains 32-Bit libraries and software for 64-Bit systems.", "https://archlinux.org/packages/multilib/", false, true)

export function getRepos_ArchLinux() {
    const repoList: Array<PackageRepository> = [
        repoCore,
        repoExtra,
        repoMultilib
    ]

    return repoList
}


export function getPackageGroups_ArchLinux() {
    const groupBase = new PackageGroup(
        "Base",
        "All packages that are needed for a working Install of ArchLinux.",
        ["base", "linux", "linux-firmware", "nano", "vi", "vim", "sudo", "networkmanager", "amd-ucode", "intel-ucode", "man-db", "man-pages", "texinfo", "openssh", "grub", "efibootmgr", "zsh", "fish", "fastfetch", "btop"],
        [repoCore, repoExtra],
        true,
        false
    )

    const groupDevel = new PackageGroup(
        "Development",
        "Base-Packages for developing Software",
        ["base-devel", "clang", "rust", "nodejs", "npm", "git", "jdk-openjdk", "python", "cmake", "zig"],
        [repoCore, repoExtra],
        false,
        true
    )

    const groupServer = new PackageGroup(
        "Server",
        "Common Applications used on/for servers",
        ["ngnix-mainline", "mariadb", "postgresql", "apache", "php", "cockpit", "cockpit-packagekit", "cockpit-podman", "podman"],
        [repoCore, repoExtra],
        false,
        true
    )

    const groupPlasma = new PackageGroup(
        "KDE Plasma",
        "The KDE Plasma Desktop Enviroment and surrounding Apps.",
        ["plasma-meta", "plasma-login-manager", "konsole", "kate", "discover", "firefox", "plasma-keyboard", "powerdevil"],
        [repoCore, repoExtra],
        true,
        true
    )

    const groupPlasmaMobile = new PackageGroup(
        "KDE Plasma-Mobile",
        "A Graphical Enviroment for Touch-based Devices from KDE.",
        ["plasma-mobile", "plasma-settings", "angelfish"],
        [repoCore, repoExtra],
        false,
        true
    )

    const groupGnome = new PackageGroup(
        "GNOME",
        "The GNOME Desktop Enviroment and surrounding Apps.",
        ["gnome", "gnome-circle"],
        [repoCore, repoExtra],
        false,
        true
    )
    
    const groupCosmic = new PackageGroup(
        "COSMIC",
        "The COSMIC Desktop Enviroment from System76.",
        ["cosmic"],
        [repoCore, repoExtra],
        false,
        true
    )

    const groupXfce = new PackageGroup(
        "XFCE",
        "The XFCE Desktop Enviroment.",
        ["xfce4", "xfce4-goodies"],
        [repoCore, repoExtra],
        false,
        true
    )

    const groupList = [
        groupBase,
        groupDevel,
        groupServer,
        groupPlasma,
        groupPlasmaMobile,
        groupGnome,
        groupCosmic,
        groupXfce,
    ]

    return groupList
}

export async function queryPackages_ArchLinux(queryUrl: string) {
    return (await axios.get(String(queryUrl))).data.results.map((p)=>{
        return {name: p.pkgname, repo: p.repo}
    })
}