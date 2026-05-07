#!/usr/bin/env node
// eslint-disable-next-line
// @ts-nocheck
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const timedatectl = spawn("timedatectl", ["list-timezones"]);

let output = "";
let outputArray;

timedatectl.stdout.on("data", (data) => {
    output += data.toString();
});

timedatectl.on("close", () => {
    outputArray = output.split("\n").map((e)=>e.split("/"));
    //console.log(outputArray)
    let groupList = []
    let finalList = {}
    let remainingList = []
    outputArray.forEach((e)=>{
        if (e.length > 1) {
            groupList = [...groupList, e[0]]
        } else {
            remainingList = [...remainingList, e[0]]
        }
    })
    let tmpSet = new Set(groupList)
    groupList = [...tmpSet]
    groupList.forEach((e)=> {
        let innerList = []
        outputArray.forEach((e2)=>{
            if (e2.length > 1) {
                if(e2[0] === e) {
                    innerList = [...innerList, e2[1]]
                }
            }
        })
        finalList = {...finalList, [e]: innerList}
    })
    finalList = {...finalList, "Other": remainingList}
    console.log(finalList)
    writeFileSync("timezones.json", JSON.stringify(finalList, null, 4), (err)=>{
        if (err) throw err;
    })
});