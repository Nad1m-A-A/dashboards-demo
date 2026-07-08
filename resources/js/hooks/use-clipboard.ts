// Credit: https://usehooks-ts.com/
import { useState } from 'react';

export type CopiedValue = string | null;
export type CopyFn = (text: string) => Promise<boolean>;
export type UseClipboardReturn = [CopiedValue, CopyFn];

// Fallback for non-secure contexts (e.g. served over plain HTTP) where the
// async Clipboard API is unavailable.
function copyWithExecCommand(text: string): boolean {
    if (typeof document === 'undefined') {
        return false;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    let succeeded = false;

    try {
        succeeded = document.execCommand('copy');
    } catch {
        succeeded = false;
    }

    document.body.removeChild(textarea);

    return succeeded;
}

export function useClipboard(): UseClipboardReturn {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);

    const copy: CopyFn = async (text) => {
        if (navigator?.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                setCopiedText(text);

                return true;
            } catch (error) {
                console.warn('Copy failed', error);
            }
        }

        if (copyWithExecCommand(text)) {
            setCopiedText(text);

            return true;
        }

        console.warn('Clipboard not supported');
        setCopiedText(null);

        return false;
    };

    return [copiedText, copy];
}
