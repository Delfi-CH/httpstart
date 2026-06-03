# httpstart

Web-based installer for Linux Distributions

## Supported Distributions

### Current

- none

### Work in Progress

- ArchLinux
- Debian 13

### Planned

- Ubuntu 26.04 LTS
- AlmaLinux 10
- Fedora 44
- Alpine
- OpenSUSE Leap
- OpenSUSE Tumbleweed

## TODO

### Frontend

Displaying backend progress

Actual Partition Editor that inst just cfdisk

### Backend

fixes, lots of fixes

## Installation

There are no releases yet.

## Packaging

We include a script named `bundle.sh`, which autobundles deb, rpm, tar.gz and pacman

### Packaging for Debian/Ubuntu

Run

```bash
./bundle.sh deb
```

Output: `dist/httpstart-debian.deb`

### Packaging for RPM-based systems

**NOT IMPLEMENTED YET**

Run

```bash
./bundle.sh rpm
```

### Packaging for ArchLinux

Run

```bash
./bundle.sh pacman
```

Output: `dist/httpstart-{version}-{architecture}.pkg.tar.zst`