class User {
    username: string
    password: string
    sudo: boolean
    ssh: boolean
    constructor(username: string, password: string, sudo: boolean, ssh: boolean) {
        this.username = username
        this.password = password
        this.sudo = sudo
        this.ssh = ssh
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(obj: any): User {
        return new User(
            obj.username,
            obj.password,
            obj.sudo,
            obj.ssh
        )
    }
}

enum DiskType {
    root,
    boot,
    efi,
    home,
    swap,
    tmp,
    usr,
    var,
    any
}

enum Filesystem {
    ext4,
    btrfs,
    xfs,
    fat32,
    swap,
    none
}

class Disk {
    name: string
    size: string
    mountpoints: Array<string>
    filesystem: Filesystem
    type: DiskType = DiskType.any
    constructor(name: string, size: string, type: DiskType, mountpoints: Array<string>, filesystem: Filesystem) {
        this.name = name
        this.size = size
        this.type = type
        this.mountpoints = mountpoints
        this.filesystem = filesystem
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(obj: any): Disk {
        return new Disk(
            obj.name,
            obj.size,
            obj.type,
            obj.mountpoint,
            obj.filesystem
        )
    }
}

class ParentDisk {
    name: string
    size: string
    constructor(name: string, size: string) {
        this.name = name
        this.size = size
    }
}

class Data {
    language: string
    timezone: string
    keymap: string
    packages: Array<string>
    hostname: string
    users: Array<User>
    disks: Array<Disk>
    parentDisks: Array<ParentDisk>
    constructor(language: string, timezone: string, keymap:string, packages: Array<string>, hostname: string, users: Array<User>, disks: Array<Disk>, parentDisks: Array<ParentDisk>) {
        this.language = language
        this.timezone = timezone
        this.keymap = keymap
        this.packages = packages
        this.hostname = hostname
        this.users = users
        this.disks = disks
        this.parentDisks = parentDisks
    }
    save() {
        localStorage.setItem("data", JSON.stringify(this))
    }
    static load() {
        const raw = localStorage.getItem("data")
        const parsed = raw ? Data.fromJSON(JSON.parse(raw)) : new Data("", "", "", [], "", [], [], [])
        return parsed
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(obj: any): Data {
    return new Data(
      obj.language,
      obj.timezone,
      obj.keymap,
      obj.packages,
      obj.hostname,
      obj.users,
      obj.disks,
      obj.parentDisks
    )
  }
}

export { Data, Disk, User, Filesystem, DiskType, ParentDisk }