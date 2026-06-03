import { Data, ProgressObject } from "../../../../lib/data";
import { spawn } from 'node:child_process';
import { once } from 'node:events';

export async function runInstall_Archlinux(data: Data, callback: (progress: ProgressObject) => void) {
    const language = data.language
    const timezone = data.timezone
    const packages = data.packages
    const hostname = data.hostname
    const users = data.users
    const disks = data.disks

    const script = spawn("/usr/share/httpstart/install.py", ["-t", timezone, "-l", language, "-H", hostname, "-p", JSON.stringify(packages), "-u", JSON.stringify(users), "-d", JSON.stringify(disks)])

    script.stdout.on('data', (data)=>{
        console.log("install stdout: " +data)
    })

    script.stderr.on('data', (data)=>{
        console.log("install stderr: " +data)
    })

    const [code] = await once(script, "close");
    if (code != 0) {
        throw new Error("Script exited with errors!")
    }
    callback(new ProgressObject("Finished!", 100, true))
}