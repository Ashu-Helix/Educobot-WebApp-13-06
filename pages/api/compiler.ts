import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from 'next'
import { spawnSync } from 'child_process';
import * as path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {

    const dir = path.join(__dirname, '../..', 'scripts');
    const outputDir = path.join(__dirname, '../..', 'outputs')
    const candidateId = 47
    const commands = path.join(outputDir, `${candidateId}.txt`)
    const fileName = path.join(dir, `${candidateId}.py`)
    try {
        let body: string = req.body?.script
        if (body === '' || body === null) {
            return
        }

        let slug: string = req.body?.slug;
        let len = slug.length;
        const directoryPath = path.join(process.cwd(), "python")

        const files = (readdirSync(directoryPath))
        if (!files.includes(`${slug}.py`)) {
            return res.status(404).json({ error: "NOT Found" })
        }
        if (!existsSync(dir)) {
            mkdirSync(dir);
        }
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir)
        }

        // let index = body.indexOf('import dog') //** */
        // let newLine = `\ndog.setFile('${outputDir}','${candidateId + '.txt'}')\n`
        // body = (body.slice(index, 10) + newLine + body.slice(10))

        let index = body.indexOf(`import ${slug}`)
        let newLine = `\n${slug}.setFile('${outputDir}','${candidateId + '.txt'}')\n`
        body = (body.slice(index, (len + 7)) + newLine + body.slice(len + 7))

        writeFileSync(fileName, `import sys, os\n\nsys.path.append(os.path.join(os.getcwd(),\'python\'))\n${body}`)
        const scriptExecution = spawnSync('python', [fileName], {
            input: req.body?.input,
            timeout: 3000
        })
        if (scriptExecution.status === 0) {
            let result = scriptExecution.stdout?.toString().trim()
            try {
                // const outputfile = `${outputDir}\\some.txt` //path.join(process.cwd(), "outputs", "demo.txt")
                const data = readFileSync(commands, 'utf8')
                res.status(200).json({ commands: data, message: result })
            } catch (error) {
                return res.status(500).json({ error })
            }
            // if (result !== '') {
            //     res.status(200).json({ message: result })
            // }
            // else {
            //     return res.status(500).json({ error: 'NOTHING_TO_PRINT' })
            // }
        } else {
            let error = scriptExecution.stderr.toString().trim().replace(fileName, 'Solution.py')

            return res.status(401).json({ error })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }

}