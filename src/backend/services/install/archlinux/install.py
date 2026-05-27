#!/usr/bin/env python3
import argparse
import json

#python src/backend/services/install/archlinux/install.py -t Europe/Paris -p "base,linux" -u '[{"username": "root", "password": "root"},{"username": "server", "password": "server"}]' -d '[{"name": "/dev/sda1", "size": "958G"}, {"name": "/dev/sda2", "size": "29G"}]'

argparser = argparse.ArgumentParser(prog="Installation script", description="Helps to install ArchLinux (btw)", exit_on_error=True)
argparser.add_argument("-l", "--language") # -l de-DE
argparser.add_argument("-t", "--timezone") # -t Europe/Paris
argparser.add_argument("-p", "--packages") # -p "base,linux"
argparser.add_argument("-H", "--hostname") # -H ubuntu-server
argparser.add_argument("-u", "--users") # -u '[{"username": "root", "password": "root"},{"username": "server", "password": "server"}]'
argparser.add_argument("-d", "--disks") # -d '[{"name": "/dev/sda1", "size": "958G"}, {"name": "/dev/sda2", "size": "29G"}]'

args = argparser.parse_args()

print(args.language, args.timezone, args.packages.split(","), args.hostname, json.loads(args.users), json.loads(args.disks))