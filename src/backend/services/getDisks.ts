import linuxOsInfo from "@delfi-ch/linux-os-info-esmodule"
import { execSync } from 'node:child_process';

export function getDiskInformation(): object {
    const info = linuxOsInfo({mode: 'sync'})
    if (info.platform !== "linux") {
        throw new Error("Not a Linux system!")
    } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const stdout = execSync("lsblk --json --output NAME,SIZE,MOUNTPOINTS,FSTYPE,TYPE", {encoding: "utf-8"})
        return JSON.parse(stdout)
    }
}