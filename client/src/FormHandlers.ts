import { Dispatch, ChangeEvent, FormEvent } from 'react';

export const getChangeHandler = (
    setInputs: Dispatch<any>,
    setErrors: Dispatch<any>
) => {
    return (event: ChangeEvent) => {
        const target = event.target as HTMLInputElement;

        const name = target.name;
        const value = target.value;

        setInputs((values: any) => ({ ...values, [name]: value }));
        // Resetting errors for this field
        setErrors((values: any) => ({ ...values, [name]: '' }));
    };
};

export const getSubmitHandler = (
    url: string,
    inputs: any,
    setErrors: Dispatch<any>,
    setLoading: Dispatch<any>,
    onSuccess: Function
) => {
    return (event: FormEvent<HTMLInputElement>) => {
        event.preventDefault();

        setLoading(true);

        (async () => {
            const rawResponse = await fetch(
                url,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputs),
                }
            ).finally(() => {
                setLoading(false);
            });
            const content = await rawResponse.text();

            if (rawResponse.status === 400) {
                setErrors(JSON.parse(content));
            } else if (rawResponse.status === 200) {
                onSuccess();
            }
        })();
    };
};
