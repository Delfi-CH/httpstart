import express from "express";
import { argv } from "node:process";
import cors from "cors";
import {getDiskInformation} from "./getDisks.ts"

const app = express();
app.use(cors())
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

app.listen(port, "0.0.0.0", ()=>{
    console.log("Server running on port " + port)
})
