import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useState } from 'react';
import Canvas from '../../../components/Canvas';
import { loadCanvasItems } from '../../../components/helpers';
import styles from '../../../styles/Problems.module.css'
import Image from 'next/image'
import dynamic from 'next/dynamic';
import KeyBoardContainer from '../../../components/KeyBoardContainer';
import { GetServerSideProps } from 'next';
import path from 'path';
import { existsSync, writeFileSync } from 'fs';
const EditorContainer = dynamic(import('../../../components/EditorContainer'), { ssr: false })

export const getServerSideProps: GetServerSideProps = async (context) => {
    const res = await fetch(`${process.env.SERVER_URL}/files/${context.params.slug}.js`)
    if (res.status === 404) {
        return {
            notFound: true,
        }
    }
    const anim = await res.text()
    const animPath = path.join(process.cwd(), "public", "anim")
    const animFileName = path.join(animPath, `${context.params.slug}.js`)
    if (!existsSync(animFileName)) {

        writeFileSync(animFileName, anim);
    }
    return {
        props: { slug: context.params.slug },
    }
}


export default function Slug(props) {
    const router = useRouter()
    const { slug } = props
    const [script, setScript] = useState('');
    const [command, setcommand] = useState('')
    const [output, setOutput] = useState('')
    const [error, seterror] = useState<string>()
    const [reset, setReset] = useState(false)
    const [keyboardState, setkeyboardState] = useState(false)
    const [sampleCode, setsampleCode] = useState('')
    useEffect(() => {
        try {
            window[`${slug}`] = require(`../../../public/anim/${slug}.js`);
        }
        catch (e) {
            new Error('error')
        }

        (async () => {
            let loadCode = loadCanvasItems(slug)?.sampleCode
            setsampleCode(loadCode)
        })()
    }, [slug])
    const handleClick = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            script,
            slug
        });

        fetch(`${process.env.URL}//compiler`, {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        })
            .then(response => response.text())
            .then(result => {
                let cmd = JSON.parse(result)
                if (cmd?.commands) {
                    setcommand(cmd?.commands)
                    seterror('')
                }
                if (cmd?.message) {
                    setOutput(cmd?.message)
                }
                if (cmd?.error) {
                    console.log(cmd.error)
                    setOutput('')
                    seterror(cmd?.error)
                }
            })
            .catch(error => {
                seterror(error)
            });
    }
    const deleteFile = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch(`${process.env.URL}//deleteFile`, {
            method: 'post',
            body: JSON.stringify({ id: "47" }),
            headers: myHeaders,
            redirect: 'follow'
        })
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(err => console.log(err))
    }
    const handleChange = (data: any) => {
        setScript(data)
    }


    return (<>
        <div className={styles.container}>
            <EditorContainer
                language="python"
                theme='material'
                handleChange={handleChange}
                value={script}
                className={styles.editor}
            />

            < div id="circle" className={styles.canvas}>
                <div className={styles.neumorphic_button_container}>
                    <button className={`${styles.neumorphic_button}  ${styles.tooltip}`}
                        data-position="bottom" data-tooltip="Run Code"
                        id='runbtn'
                        onClick={handleClick}
                    >
                        <span className={`${styles.tooltiptext}`}>Run Scritp</span>
                        <Image src="/assets/run_button_icon_landscape.png"
                            width="30" height="30"
                        />
                    </button>
                    <button className={`${styles.neumorphic_button}  ${styles.tooltip}`}
                        data-position="bottom" data-tooltip="Reset Output"
                        onClick={() => setReset(!reset)}
                    >
                        <span className={`${styles.tooltiptext}`}>Run Scritp</span>
                        <img src="/assets/reset_button_icon.png"
                            width="30" height="30"
                        />
                    </button>
                    <button className={`${styles.neumorphic_button}  ${styles.tooltip}`}
                        data-position="bottom" data-tooltip="Help"
                        onClick={deleteFile}
                    >
                        <span className={`${styles.tooltiptext}`}>Help</span>
                        <img src="/assets/help_button_icon.png"
                            width="30" height="30"
                        />
                    </button>
                    <button id="keyboardbutton" className={`${styles.neumorphic_button}  ${styles.tooltip}`}
                        data-position="bottom" data-tooltip="Open Keyboard"
                        onClick={() => setkeyboardState(!keyboardState)}
                    >
                        <span className={`${styles.tooltiptext}`}>Open Keyboard</span>
                        <img src="/assets/Keyboard.png"
                            width="30" height="30"
                        />
                    </button>
                    <button id="autofill" className={`${styles.neumorphic_button}  ${styles.tooltip}`}
                        data-position="bottom" data-tooltip="Demo Run Code"
                        onClick={() => setScript(sampleCode)}
                    >
                        <span className={`${styles.tooltiptext}`}>Reset Scritp</span>
                        <img src="/assets/Auto_fill_button_icon.png"
                            width="30" height="30"
                        />
                    </button>
                </div>
                {slug && <Canvas
                    command={command}
                    id="sprite"
                    className={''}
                    handleReset={setReset}
                    reset={reset}
                    setCommand={setcommand}
                    slug={slug}
                />}
                {error && <div id="error" className={styles.output}>{error}</div>}
                {output && <div className={styles.output}>{output}</div>}
            </div >
            {keyboardState && <KeyBoardContainer script={script} setScript={setScript} />}
        </div >
    </>
    );
}
