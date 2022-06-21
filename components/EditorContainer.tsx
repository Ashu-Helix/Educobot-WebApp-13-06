import { useEffect } from 'react';
import { Controlled } from 'react-codemirror2'
interface EditorProps {
    language?: 'python';
    theme?: 'material';
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
                handleChange(value)
            }}
            className={className}

        />
    )
}

export default EditorContainer
