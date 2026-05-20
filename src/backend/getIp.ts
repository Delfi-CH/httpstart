// ip -4 route get 1.1.1.1
// ip -6 route get 2606:4700:4700::1111
import { execSync } from 'node:child_process';
import linuxOsInfo from "@delfi-ch/linux-os-info-esmodule"

export function getIpAdress() {
    const info = linuxOsInfo({mode: 'sync'})
    if (info.platform !== "linux") {
        throw new Error("Not a Linux system!")
    } else {
        const stdout = execSync("ip -4 route get 1.1.1.1", {encoding: "utf-8"})

        return stdout.split(" ")[6]
    }
}

getIpAdress()