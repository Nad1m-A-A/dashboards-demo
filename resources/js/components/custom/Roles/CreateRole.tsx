import { Form, usePage } from '@inertiajs/react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Heading from '@/components/heading';
import { RoleWizard } from '@/components/custom/Roles/RoleWizard';
import { Button } from '@/components/ui/button';
import { useClipboard } from '@/hooks/use-clipboard';
import { store } from '@/routes/roles-and-permissions';
import type { PageProps } from '@/types/ui';

const COPIED_FEEDBACK_MS = 5000;

function CopyPasscodeButton({ passcode }: { passcode: string }) {
    const [, copy] = useClipboard();
    const [showCopied, setShowCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleCopy = async (): Promise<void> => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
        }

        const copied = await copy(passcode);

        if (!copied) {
            return;
        }

        setShowCopied(true);
        timeoutRef.current = setTimeout(() => {
            setShowCopied(false);
            timeoutRef.current = null;
        }, COPIED_FEEDBACK_MS);
    };

    return (
        <Button
            type="button"
            onClick={handleCopy}
            size="icon"
            variant="ghost"
            aria-label={showCopied ? 'Copied' : 'Copy passcode'}
        >
            {showCopied ? (
                <CheckIcon className="size-4" aria-hidden />
            ) : (
                <CopyIcon className="size-4" aria-hidden />
            )}
            <span className="sr-only">{showCopied ? 'Copied' : 'Copy passcode'}</span>
        </Button>
    );
}

function CreateRole() {
    const { flash, permissionGroups } = usePage<PageProps>().props;
    const [wizardKey, setWizardKey] = useState(0);

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title="Create Role"
            />

            <Form
                {...store.form()}
                options={{
                    preserveScroll: true,
                }}
                onSuccess={() => setWizardKey((key) => key + 1)}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <RoleWizard
                            key={wizardKey}
                            permissionGroups={permissionGroups}
                            processing={processing}
                            errors={errors}
                        />

                        {(flash.store_success || flash.store_error) && (
                            <div className="flex items-center gap-4">
                                {flash.store_success && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-green-500">{flash.store_success}</p>
                                        {/* <CopyPasscodeButton
                                            passcode={
                                                flash.store_success.split(' ').at(-1) ?? ''
                                            }
                                        /> */}
                                    </div>
                                )}
                                {flash.store_error && (
                                    <p className="text-red-500">{flash.store_error}</p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </Form>
        </div>
    )
}

export default CreateRole
