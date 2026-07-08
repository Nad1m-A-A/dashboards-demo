import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { businesses } from '@/data/businesses';
import { store } from '@/routes/login';

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">

                            <PasswordInput
                                id="password"
                                name="password"
                                tabIndex={2}
                                className="bg-card"
                                autoComplete="current-password"
                                defaultValue="demo-passcode"
                                placeholder="Passcode"
                            />
                            <InputError message={errors.password} />

                            <Button
                                type="submit"
                                className="w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>

                            <div className="flex items-center justify-center gap-4 mt-8">
                                {businesses.map((business) => (
                                    <img

                                        key={business.name}
                                        src={business.logo}
                                        alt={business.label}
                                        className="size-12 rounded-full object-cover animate-in fade-in duration-700"
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in',
};
