import express from "express";
import cors from "cors";
import {getDiskInformation} from "./getDisks.ts"

const app = express();
app.use(cors())
app.use("/ui", express.static("build"))

const port = 29222;
app.get("/api", (req, res)=> {
    res.send("hello, world")
})

app.get("/api/disks", (req, res)=> {
    res.send(getDiskInformation())
})

app.listen(port, "0.0.0.0", ()=>{
    console.log("server running")
})
