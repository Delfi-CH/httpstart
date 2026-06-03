#!/usr/bin/env python3
import argparse
import json
import os
import sys
import subprocess


def run(cmd):
    subprocess.run(cmd, check=True)


def load_json(arg, name):
    try:
        return json.loads(arg)
    except json.JSONDecodeError as e:
        sys.exit(f"Invalid JSON for {name}: {e}")


def check_root():
    if os.getuid() != 0:
        sys.exit("Must run as root")


def check_uefi():
    path = "/sys/firmware/efi/fw_platform_size"
    if not os.path.isfile(path):
        sys.exit("Not booted in UEFI mode")
    with open(path) as f:
        if f.read().strip() != "64":
            sys.exit("UEFI must be 64-bit")


def check_internet():
    res = subprocess.run(
        ["ping", "-c", "1", "ping.archlinux.org"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if res.returncode != 0:
        sys.exit("No internet connection")


def format_and_mount(disks):
    disks = sorted(disks, key=lambda d: d["mountpoints"][0] != "/")

    for d in disks:
        disk = "/dev/" + d["name"]
        fs = d["filesystem"]
        mp = d.get("mountpoints", [None])[0]

        if not mp:
            continue

        if fs == "ext4":
            run(["mkfs.ext4", "-F", disk])
            run(["mount", "--mkdir", disk, f"/mnt{mp}"])

        elif fs == "btrfs":
            run(["mkfs.btrfs", "-f", disk])
            run(["mount", "--mkdir", disk, f"/mnt{mp}"])

        elif fs == "xfs":
            run(["mkfs.xfs", "-f", disk])
            run(["mount", "--mkdir", disk, f"/mnt{mp}"])

        elif fs == "vfat":
            run(["mkfs.fat", "-F", "32", disk])
            run(["mount", "--mkdir", disk, f"/mnt{mp}"])

        elif fs == "swap":
            run(["mkswap", disk])
            run(["swapon", disk])

        else:
            sys.exit(f"Unsupported filesystem: {fs}")


def install_base(packages):
    run(["pacstrap", "-K", "/mnt", *packages])


def generate_fstab():
    with open("/mnt/etc/fstab", "w") as f:
        subprocess.run(["genfstab", "-U", "/mnt"], stdout=f, check=True)

def chroot(cmd, input_data=None):
    subprocess.run(
        ["arch-chroot", "/mnt", *cmd],
        stdin=input_data,
        check=True
    )

def run_firstboot(language, timezone, hostname):
    cmd = ["systemd-firstboot", "--root=/mnt"]

    if language:
        cmd += ["--locale", language]

    if timezone:
        cmd += ["--timezone", timezone]

    if hostname:
        cmd += ["--hostname", hostname]

    # optional but useful defaults
    cmd += ["--keymap", "us"]

    subprocess.run(cmd, check=True)

def enable_sudo():
    sudoers_file = "/etc/sudoers.d/wheel"
    chroot(["pacman", "-S", "--noconfirm", "sudo"])

    chroot([
        "bash", "-c",
        "echo '%wheel ALL=(ALL:ALL) ALL' > /etc/sudoers.d/wheel"
    ])

    chroot(["chmod", "440", sudoers_file])

    chroot(["visudo", "-cf", sudoers_file])


def setup_users(users):
    for u in users:
        name = u["username"]
        password = u.get("password", "changeme")
        use_sudo = u.get("sudo", False)

        groups = ["wheel"] if use_sudo else []

        cmd = ["useradd", "-m"]
        if groups:
            cmd += ["-G", ",".join(groups)]
        cmd += [name]

        chroot(cmd)

        chroot(
            ["chpasswd"],
            input_data=f"{name}:{password}\n".encode()
        )

    if any(u.get("sudo", False) for u in users):
        enable_sudo()

def normalize_locale(locale):
    return locale.replace("-", "_") + ".UTF-8"

def install_grub(disks):
    chroot(["pacman", "-S", "--noconfirm", "grub", "efibootmgr"])

    esp = None
    for d in disks:
        if d.get("type") == "efi":
            esp = d.get("mountpoints", [None])[0]
            break

    if not esp:
        return

    chroot([
        "grub-install",
        "--target=x86_64-efi",
        "--efi-directory=" + esp,
        "--bootloader-id=GRUB"
    ])

    chroot([
        "grub-mkconfig",
        "-o",
        "/boot/grub/grub.cfg"
    ])

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-l", "--language")
    parser.add_argument("-t", "--timezone")
    parser.add_argument("-p", "--packages", required=True)
    parser.add_argument("-H", "--hostname")
    parser.add_argument("-u", "--users", required=True)
    parser.add_argument("-d", "--disks", required=True)

    args = parser.parse_args()

    packages = load_json(args.packages, "packages")
    users = load_json(args.users, "users")
    disks = load_json(args.disks, "disks")

    print(args.language, args.timezone, args.hostname)
    print(packages)
    print(users)
    print(disks)

    check_root()
    check_uefi()
    check_internet()

    format_and_mount(disks)
    install_base(packages)
    generate_fstab()

    run_firstboot(normalize_locale(args.language), args.timezone, args.hostname)
    setup_users(users)

    chroot(["mkinitcpio", "-P"])

    install_grub(disks)

if __name__ == "__main__":
    main()