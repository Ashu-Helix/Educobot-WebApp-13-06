import { useEffect } from 'react';
import { UnControlled, Controlled } from 'react-codemirror2'
interface EditorProps {
    language?: 'python';
    theme?: 'material';
    handleKeyDown?: any;
    onLoad?: any;
    className?: string;
}

function PythonCode({ language, theme, handleKeyDown, className, onLoad }: EditorProps) {

    useEffect(() => {
        onLoad()
    }, [])
    return (
        // <Editor language={language} theme={theme} onChange={handleChange}></Editor>
        <UnControlled
            options={{
                mode: language,
                theme: theme,
                lineNumbers: true,
                // mode: { name: "xml", htmlMode: true, language },
            }}
            onKeyDown={handleKeyDown}
            //onFocus={(editor) => { console.log(editor) }}
            className={className}
        />
    )

}

export default PythonCode
