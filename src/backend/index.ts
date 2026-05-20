import express from "express";
import { argv } from "node:process";
import cors from "cors";
import {getDiskInformation} from "./services/getDisks.ts"
import { getDistibution } from "./services/getDistro.ts";
import { getIpAdress } from "./services/getIp.ts";
import { getRepos } from "./services/getPackages.ts";

const app = express();
app.use(cors())
app.use(express.json())
app.use("/ui", express.static(argv[3]))

const port = Number(argv[2]);

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

app.listen(port, "0.0.0.0", ()=>{
    console.log("Server running on port " + port)

})
