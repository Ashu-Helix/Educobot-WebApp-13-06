import { useEffect } from 'react';
import { Controlled } from 'react-codemirror2';
import "../node_modules/codemirror/theme/yonce.css"
import "../node_modules/codemirror/mode/python/python"
interface EditorProps {
    language?: string;
    theme?: string;
    handleChange?: any;
    value: string;
    className?: string;
}

function EditorContainer({ language, theme, handleChange, value, className }: EditorProps) {

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
            className={className}
        />
    )
}

export default EditorContainer
