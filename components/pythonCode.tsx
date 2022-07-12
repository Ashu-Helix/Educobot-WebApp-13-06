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
        // <Editor language={language} theme={theme} onChange={handleChange}></Editor>
        <UnControlled
            options={{
                mode: language,
                theme: theme,
                lineNumbers: true,
                readOnly: true,
                // mode: { name: "xml", htmlMode: true, language },
            }}

            onKeyDown={handleKeyDown}
            // onFocus={(editor) => { var ele = editor.display.input.textarea; ele.setAttribute("readonly", "readonly"); }}
            // onFocus={(editor) => { try { editor.display.input.textarea.setAttribute("readonly", "readonly"); } catch (err) { console.log(err); } }}
            // onFocus={(editor) => {
            //     console.log(editor);
            //     // hideKeyboard(editor.display.input.textarea)
            // }}
            onFocus={(ed, event) => {
                if (window.screen.availWidth > 600) return;
                setkeyboardState(true)
            }}
            className={className}
        />
    )



    function hideKeyboard(element) {
        console.log("I AM", element);
        // alert(element);

        // element.attr('readonly', 'readonly'); // Force keyboard to hide on input field.
        element.setAttribute("readonly", "readonly");

        // element.attr('disabled', 'true'); // Force keyboard to hide on textarea field.
        element.setAttribute("disabled", "true");

        setTimeout(function () {
            element.blur();  //actually close the keyboard
            // Remove readonly attribute after keyboard is hidden.
            // element.removeAttr('readonly');
            element.removeAttribute("readonly");
            // element.removeAttr('disabled');
            element.removeAttribute("disabled");
        }, 100);
    }

}

export default PythonCode
