import { Distribution } from "../../lib/data.ts"
import linuxOsInfo from "@delfi-ch/linux-os-info-esmodule"

export function getDistibution(): Distribution {
    const info = linuxOsInfo({mode: 'sync'})
    switch (info.name) {
        case Distribution.Ubuntu: return Distribution.Ubuntu
        case Distribution.Debian: return Distribution.Debian
        case Distribution.Fedora: return Distribution.Fedora
        case Distribution.Alma: return Distribution.Alma
        case Distribution.RHEL: return Distribution.RHEL
        case Distribution.OpenSUSE_Tumbleweed: return Distribution.OpenSUSE_Tumbleweed
        case Distribution.OpenSUSE_LEAP: return Distribution.OpenSUSE_LEAP
        case Distribution.Alpine: return Distribution.Alpine
        case Distribution.ArchLinux: return Distribution.ArchLinux
        default: return Distribution.Other
    }
}