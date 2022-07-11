import dynamic from 'next/dynamic';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { Controlled } from 'react-codemirror2';
import "codemirror/theme/yonce.css"
import "codemirror/mode/python/python"
interface EditorProps {
    language?: string;
    theme?: string;
    handleChange?: any;
    value: string;
    className?: string;
    setkeyboardState?: (value) => void,
    setEditorState?: (value) => void
    setOnlyKeyboard?: (value) => void
}

function EditorContainer({ language, theme, handleChange, value, className, setkeyboardState, setEditorState, setOnlyKeyboard }: EditorProps) {
    useLayoutEffect(() => {
        document.getElementsByClassName("CodeMirror-code")[0].setAttribute("virtualkeyboardpolicy", "manual")
    }, [])

    return (
        <Controlled
            value={value}
            options={{
                mode: language,
                theme: theme,
                lineNumbers: true,
                extraKeys: {
                    "Ctrl-Space": "autocomplete"
                },
                matchBrackets: true,
                //inputStyle: "contenteditable",
                // mode: { name: "xml", htmlMode: true, language },
            }}
            onBeforeChange={(editor, data, value) => {
                handleChange(value)
            }}
            onChange={(editor, data, value) => {

                //if (setEditorState)
                //  setEditorState(editor)
                handleChange(value)
            }}
            className={className}

        />
    )
}

export default EditorContainer
