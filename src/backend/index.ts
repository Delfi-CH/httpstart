import express from "express";
import { argv } from "node:process";
import cors from "cors";
import {getDiskInformation} from "./services/getDisks.ts"
import { getDistibution } from "./services/getDistro.ts";
import { getIpAdress } from "./services/getIp.ts";
import { getPackageGroups, getRepos, queryPackages } from "./services/getPackages.ts";
import { createServer } from "http";
import { setupHtmshell } from "express-htmshell";
import { beginInstall, validateData } from "./services/install/doInstall.ts";
import { Data, Distribution, ProgressObject } from "../lib/data"

const app = express()
const server = createServer(app)
app.use(cors())
app.use(express.json())
app.use("/ui", express.static(argv[3]))

const port = Number(argv[2]);
let installInProgress = false

let data: Data = new Data("", "", "", [], "", [], [], [], Distribution.Other)

app.get("/", (req,res)=>{
    res.redirect("/ui")
})

app.get("/api", (req, res)=> {
    res.send("hello, world")
})

app.get("/api/disks", (req, res)=> {
    res.send(getDiskInformation())
})

app.get("/api/distro", (req,res)=>{
    res.send({distro: getDistibution()})
})

app.get("/api/ipadrr", (req, res)=>{
    res.send({ip: getIpAdress()})
})

app.get("/api/pkg/repos", (req, res)=> {
    res.send(getRepos())
})

app.get("/api/pkg/groups", (req, res)=> {
    res.send(getPackageGroups())
})

app.post("/api/pkg/query", async (req, res) =>{
    const queryUrl = req.body.queryUrl
    console.log("Querying " + queryUrl)
    const result = await queryPackages(queryUrl)
    res.send(result)
})

app.post("/api/install/data", (req, res)=>{
    const tempData = req.body.data
    if (!validateData(tempData)) {
        res.sendStatus(400)
        return
    }
    if (installInProgress) {
        res.sendStatus(226)
        return
    } else {
        installInProgress = true
        data = tempData
        res.sendStatus(201)
        return
    }
})

app.get("/api/install/progress", (req, res)=>{
    if (!validateData(data)) {
        res.sendStatus(400)
        return
    } else if (!installInProgress) {
        res.sendStatus(400)
        return
    }

    // SSE Code from some dude on StackOverflow
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    beginInstall(data, (progress: ProgressObject) => {
        res.write(JSON.stringify(progress))
    })

    res.on("close", ()=>{
        console.log("SSE on /api/install/progress dropped!")
        installInProgress = false
        res.end()
        return
    })
})

setupHtmshell(server, "/api/shell")

server.listen(port, "0.0.0.0", ()=>{
    process.title = "httpstart"
    console.log("Server running on port " + port)

})
