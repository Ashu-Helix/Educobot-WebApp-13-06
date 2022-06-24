import dynamic from 'next/dynamic';
import { useEffect, useLayoutEffect } from 'react';
import { Controlled } from 'react-codemirror2';
import "codemirror/theme/yonce.css"
import "codemirror/mode/python/python"
interface EditorProps {
    language?: string;
    theme?: string;
    handleChange?: any;
    value: string;
    className?: string;
    setkeyboardState?: (value) => void
}

function EditorContainer({ language, theme, handleChange, value, className, setkeyboardState }: EditorProps) {
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
                // mode: { name: "xml", htmlMode: true, language },
            }}
            onBeforeChange={(editor, data, value) => {
                handleChange(value)
            }}
            onChange={(editor, data, value) => {

                handleChange(value)
            }}
            onFocus={(ed, event) => {
                if (window.screen.availWidth > 600) return;
                setkeyboardState(true)
            }}
            className={className}
        />
    )
}

export default EditorContainer
