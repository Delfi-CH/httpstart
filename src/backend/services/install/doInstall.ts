import { Distribution, Data, ProgressObject } from "../../../lib/data";
import { runInstall_Archlinux } from "./archlinux/install";


export function beginInstall(data: Data, callback: (progress: ProgressObject) => void) {
    if (!validateData(data)) {
        return false
    }

    switch (data.distro) {
        case Distribution.ArchLinux: runInstall_Archlinux(data, callback); break
        default: console.log("generic")
    }
}

export function validateData(data: Data): boolean {
    if (data.language === "") {
        return false
    } else if (data.timezone === "") {
        return false
    } else if (data.packages.length < 1) {
        return false
    } else if (data.hostname === "") {
        return false
    } else if (data.users.length < 1) {
        return false
    } else if (data.disks.length <1) {
        return false
    } else {
        return true
    }
}