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
                autofocus: true,
            }}
            onBeforeChange={(editor, data, value) => {
                handleChange(value)
            }}
            onChange={(editor, data, value) => {

                //if (setEditorState)
                //  setEditorState(editor)
                handleChange(value)
            }}
            onFocus={(editor, event) => {

                if (window.screen.availWidth > 600) return;
                if (setEditorState)
                    setEditorState(editor)
                setkeyboardState(true)
                setOnlyKeyboard(true)
            }}
            onCursorActivity={(editor) => {
                if (setEditorState)
                    setEditorState(editor)
            }}
            onBlur={(editor, event) => {
                if (window.screen.availWidth > 600) return;

                editor.focus()

            }}
            className={className}
        />
    )
}

export default EditorContainer
