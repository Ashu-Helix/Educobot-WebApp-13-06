/** @type {import('next').NextConfig} */
const fs = require("fs");
const { existsSync, mkdirSync, readdir, readdirSync, rm, writeFileSync } = fs
const path = require("path");

const blockly_lessons = ["4bda4814-a2b1-4c4f-b102-eda5181bd0f8", "1d749e84-1155-4269-93ab-550ee7aabd4a"];

async function getFiles() {
    const fetUrl = "http://localhost:7001/liveLessons";

    const res2 = await fetch(
        `https://api.educobot.com/lessonsRoute/getAllLessonID`, { method: 'POST' }
    );
    const data = await res2.json();

    const paths = data.data.map((t) => (t.lsID));
    const gameFolderPath = path.join(process.cwd(), "game");
    const files = ["config", "constant", "main", "Blocks", "Mcq"]
    let cancel = false;
    paths.forEach(async slug => {
        const gameSubFolder = path.join(gameFolderPath, `${slug}`);
        cancel = false;
        files.forEach(async (file) => {
            if (cancel) return
            if (blockly_lessons.includes(slug)) return
            try {
                const subfile = path.join(gameSubFolder, `${file}.js`);
                const res_file = await fetch(`${fetUrl}/${slug}/${file}.js`);

                if (res_file.status === 404) {
                    cancel = true;
                    const dir = path.join(__dirname, './', 'game', slug)
                    if (existsSync(gameSubFolder))
                        rm(dir, { recursive: true, force: true }, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    return
                }

                const res_text = await res_file.text();

                if (!existsSync(gameSubFolder)) {
                    mkdirSync(gameSubFolder);
                }
                if (!existsSync(subfile)) {
                    writeFileSync(subfile, res_text);
                }
            } catch (err) {
                console.log(err)
            }

        })
    })

}

const nextConfig = {
    reactStrictMode: true,
    env: {
        URL: "http://localhost:7001",
        PATH_URL: "https://api.educobot.com",

        SERVER_URL: "https://app.educobot.com",
        SERVER_URL1: "http://localhost:7001",
    },
    // URL: 'http://192.168.1.33:3000/api',

    fs: "empty", // This is required

    webpack: (config, options) => {
        getFiles()
        return config
    },
};

module.exports = nextConfig;