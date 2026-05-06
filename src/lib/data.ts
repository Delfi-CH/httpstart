class User {
    username: string
    password: string
    sudo: boolean
    constructor(username: string, password: string, sudo: boolean) {
        this.username = username
        this.password = password
        this.sudo = sudo
    }
    static fromJSON(obj: any): User {
        return new User(
            obj.username,
            obj.password,
            obj.sudo
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
    mountpoint: string
    filesystem: Filesystem
    type: DiskType = DiskType.any
    constructor(name: string, size: string, type: DiskType, mountpoint: string, filesystem: Filesystem) {
        this.name = name
        this.size = size
        this.type = type
        this.mountpoint = mountpoint
        this.filesystem = filesystem
    }
    
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

class Data {
    language: string
    timezone: string
    keymap: string
    packages: Array<string>
    hostname: string
    users: Array<User>
    disks: Array<Disk>
    constructor(language: string, timezone: string, keymap:string, packages: Array<string>, hostname: string, users: Array<User>, disks: Array<Disk>) {
        this.language = language
        this.timezone = timezone
        this.keymap = keymap
        this.packages = packages
        this.hostname = hostname
        this.users = users
        this.disks = disks
    }
    save() {
        localStorage.setItem("data", JSON.stringify(this))
    }
    static load() {
        const raw = localStorage.getItem("data")
        const parsed = raw ? Data.fromJSON(JSON.parse(raw)) : new Data("", "", "", [], "", [], [])
        return parsed
    }
    static fromJSON(obj: any): Data {
    return new Data(
      obj.language,
      obj.timezone,
      obj.keymap,
      obj.packages,
      obj.hostname,
      obj.users,
      obj.disks
    )
  }
}

export { Data, Disk, User, Filesystem, DiskType }