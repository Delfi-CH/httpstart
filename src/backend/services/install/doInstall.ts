import { Distribution, Data } from "../../../lib/data";


export function beginInstall(data: Data) {
    console.log(data)

    switch (data.distro) {
        case Distribution.ArchLinux: console.log("archbtw"); break
        default: console.log("generic")
    }
}