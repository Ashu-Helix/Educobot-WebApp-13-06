import React, { useState } from 'react'
import KeyboardReact from 'react-simple-keyboard'

interface Props {
    script: string;
    setScript: React.Dispatch<React.SetStateAction<string>>;
}

function KeyBoardContainer({ script, setScript }: Props) {
    const [layoutName, setlayoutName] = useState("default")
    const handleKeyPress = (input: string) => {
        if (input === "{bksp}") {
            setScript("{bksp}")
            //setScript(script.slice(0, script.length - 1))
        }
        else if (input === "{shift}") {
            setlayoutName(layoutName === "shift" ? "default" : "shift")
        }
        else if (input === "{lock}") {
            setlayoutName(layoutName === "shift" ? "default" : "shift")
        }
        else if (input === "caps") {
            setlayoutName(layoutName === "caps" ? "default" : "caps")
        }
        else if (input === "{enter}") {
            setScript(`${script}\n`)
        }
        else if (input === "{tab}") {

            setScript(`${script}    `)
        }
        else if (input === "{space}") {
            setScript(`${script} `)
        }
        else {
            setScript(`${script}${input}`)
        }
    }
    return (
        <KeyboardReact
            onKeyPress={handleKeyPress}
            theme={"hg-theme-default myTheme1 hg-layout-default"}
            layoutName={layoutName}
            layout={{
                default: [
                    '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
                    '{tab} q w e r t y u i o p [ ] \\',
                    '{lock} a s d f g h j k l ; \' {enter}',
                    '{shift} z x c v b n m , . / {shift}',
                    '( ) {space} : "'
                ],
                shift: [
                    "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
                    "{tab} Q W E R T Y U I O P { } |",
                    '{lock} A S D F G H J K L : " {enter}',
                    "{shift} Z X C V B N M < > ? {shift}",
                    "{space}"
                ],
                caps: [
                    "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                    "{tab} Q W E R T Y U I O P [ ] \\",
                    "{lock} A S D F G H J K L ; ' {enter}",
                    "{shift} Z X C V B N M , . / {shift}",
                    ".com @ {space}"
                ]
            }}
        />
    )
}

export default KeyBoardContainer
