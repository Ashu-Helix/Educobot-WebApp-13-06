import { formControlClasses } from '@mui/material';
import { useEffect, useLayoutEffect } from 'react';
import { UnControlled, Controlled } from 'react-codemirror2'
interface EditorProps {
    language?: string;
    theme?: string;
    handleKeyDown?: any;
    onLoad?: any;
    className?: string;
    setkeyboardState?: (value) => void
}

function PythonCode({ language, theme, handleKeyDown, className, onLoad, setkeyboardState }: EditorProps) {
    useLayoutEffect(() => {
        document.getElementsByClassName("CodeMirror-code")[0].setAttribute("virtualkeyboardpolicy", "manual")
    }, [])

    useEffect(() => {
        onLoad()
    }, [])
    return (
        <UnControlled
            options={{
                mode: language,
                theme: theme,
                lineNumbers: true,
                readOnly: true,
            }}

            onKeyDown={handleKeyDown}
            onFocus={(ed, event) => {
                if (window.screen.availWidth > 600) return;
                setkeyboardState(true)
            }}
            className={className}
        />
    )
}

export default PythonCode
