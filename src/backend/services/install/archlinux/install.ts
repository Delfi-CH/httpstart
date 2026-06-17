import { Data, ProgressObject } from "../../../../lib/data";
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import readline from "node:readline";

export async function runInstall_Archlinux(data: Data, callback: (progress: ProgressObject) => void) {
    const language = data.language
    const timezone = data.timezone
    const packages = data.packages
    const hostname = data.hostname
    const users = data.users
    const disks = data.disks
    
    callback(new ProgressObject("Starting Installer", 0, false))

    const script = spawn("/usr/share/httpstart/install.py", ["-t", timezone, "-l", language, "-H", hostname, "-p", JSON.stringify(packages), "-u", JSON.stringify(users), "-d", JSON.stringify(disks)])

    const rl = readline.createInterface({
        input: script.stdout,
        crlfDelay: Infinity
    })

    rl.on("line", (line)=>{
        if (line.includes("Checking for prerequisites")) {
            callback(new ProgressObject(line, 5, false))
        } else if (line.includes("Formatting Disks")) {
            callback(new ProgressObject(line, 10, false))
        } else if (line.includes("Installing Packages")) {
            callback(new ProgressObject(line, 30, false))
        } else if (line.includes("Running systemd fistboot")) {
            callback(new ProgressObject(line, 60, false))
        } else if (line.includes("Generating initcpio")) {
            callback(new ProgressObject(line, 70, false))
        } else if (line.includes("Installing Grub")) {
            callback(new ProgressObject(line, 80, false))
        }
    })

    const [code] = await once(script, "close");
    if (code != 0) {
        throw new Error("Script exited with errors!")
    }
    callback(new ProgressObject("Finished!", 100, true))
}