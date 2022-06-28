import { formControlClasses } from '@mui/material';
import { useEffect } from 'react';
import { UnControlled, Controlled } from 'react-codemirror2'
interface EditorProps {
    language?: string;
    theme?: string;
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
                readOnly: true
                // mode: { name: "xml", htmlMode: true, language },
            }}

            onKeyDown={handleKeyDown}
            // onFocus={(editor) => { var ele = editor.display.input.textarea; ele.setAttribute("readonly", "readonly"); }}
            // onFocus={(editor) => { try { editor.display.input.textarea.setAttribute("readonly", "readonly"); } catch (err) { console.log(err); } }}
            // onFocus={(editor) => { hideKeyboard(editor) }}
            className={className}
        />
    )

    function hideKeyboard(element) {
        console.log("I AM", element);

        element.attr('readonly', 'readonly'); // Force keyboard to hide on input field.
        element.attr('disabled', 'true'); // Force keyboard to hide on textarea field.
        setTimeout(function () {
            element.blur();  //actually close the keyboard
            // Remove readonly attribute after keyboard is hidden.
            element.removeAttr('readonly');
            element.removeAttr('disabled');
        }, 100);
    }

}

export default PythonCode
