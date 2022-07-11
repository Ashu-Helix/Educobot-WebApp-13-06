/** @type {import('next').NextConfig} */
const fs = require("fs");
const { existsSync, mkdirSync, readdir, readdirSync, rm, writeFileSync } = fs
const path = require("path");

const blockly_lessons = ["4bda4814-a2b1-4c4f-b102-eda5181bd0f8", "1d749e84-1155-4269-93ab-550ee7aabd4a"];

async function getFiles() {
    const fetUrl = "http://localhost:7001/liveLessons";
    // const fetUrl = "https://app.educobot.com/liveLessons/blockly";

    const res2 = await fetch(
        `https://api.educobot.com/lessonsRoute/getAllLessonID`, { method: 'POST' }
    )
    const data = await res2.json();

    const paths = data.data.map((t) => (t.lsID));
    const gameFolderPath = path.join(process.cwd(), "game");
    const files = ["config", "constant", "main", "Blocks", "Mcq"]
    let cancel = false;
    paths.forEach(async (slug, idx) => {
        const gameSubFolder = path.join(gameFolderPath, `${slug}`);
        cancel = false;
        // files.forEach(async (file) => {
        //     if (cancel) return
        //     if (blockly_lessons.includes(slug)) return
        //     try {
        //         const subfile = path.join(gameSubFolder, `${file}.js`);
        //         const res_file = await fetch(`${fetUrl}/${slug}/${file}.js`);

        //         if (res_file.status === 404) {
        //             cancel = true;
        //             const dir = path.join(__dirname, './', 'game', slug)
        //             if (existsSync(gameSubFolder))
        //             rm(dir, { recursive: true, force: true }, (err) => {
        //                 if (err) {
        //                     // console.log(err);
        //                 }
        //             })
        //             return
        //         }

        //         console.log(slug, file, res_file.status)
        //         const res_text = await res_file.text();

        //         if (!existsSync(gameSubFolder)) {
        //             mkdirSync(gameSubFolder);
        //         }
        //         if (!existsSync(subfile)) {
        //             writeFileSync(subfile, res_text);
        //         }
        //     } catch (err) {
        //         // console.log(err)
        //     }

        //  })
        try {
            // const subfile = path.join(gameSubFolder, `${file}.js`);

            const config_file = await fetch(
                `${fetUrl}/${slug}/config.js`
            );
            const constant_file = await fetch(
                `${fetUrl}/${slug}/constant.js`
            );
            const main_file = await fetch(
                `${fetUrl}/${slug}/main.js`
            );
            const block_file = await fetch(
                `${fetUrl}/${slug}/Blocks.js`
            );
            const mcq_file = await fetch(
                `${fetUrl}/${slug}/Mcq.js`
            );

            if (
                config_file.status === 404 ||
                constant_file.status === 404 ||
                main_file.status === 404 ||
                block_file.status === 404 ||
                mcq_file.status === 404
            ) {

                return;
            }

            const config_text = await config_file.text();
            const constant_text = await constant_file.text();
            const main_text = await main_file.text();
            const block_text = await block_file.text(); //block
            const mcq_text = await mcq_file.text(); //mcq

            const config_path = path.join(gameSubFolder, `config.js`);
            const constant_path = path.join(gameSubFolder, `constant.js`);
            const main_path = path.join(gameSubFolder, `main.js`);
            const block_path = path.join(gameSubFolder, `Blocks.js`);
            const mcq_path = path.join(gameSubFolder, `Mcq.js`);

            if (!existsSync(gameSubFolder)) {
                mkdirSync(gameSubFolder);

                writeFileSync(config_path, config_text);

                writeFileSync(constant_path, constant_text);

                writeFileSync(main_path, main_text);

                writeFileSync(block_path, block_text);

                writeFileSync(mcq_path, mcq_text);
            }
            console.log(idx, slug)

        } catch (err) {
            //  console.log(err)
            return;
        }
    })

}

const nextConfig = {
    reactStrictMode: true,
    env: {
        URL: "http://localhost:7001",
        PATH_URL: "https://api.educobot.com",

        SERVER_URL: "https://app.educobot.com",
        SERVER_URL1: "http://localhost:7001",
        Dashboard_URL: "http://localhost:3000/dashboard/app/",
        InternalServer: "http://localhost:3003",
    },
    // URL: 'http://192.168.1.33:3000/api',

    fs: "empty", // This is required

    webpack: (config, options) => {
        getFiles()
        return config
    },
};

module.exports = nextConfig;