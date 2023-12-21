import { Router } from "express";
import path from 'path'

const router = Router()

router.get('^/$|/index(.html)?', (_, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

export {router}