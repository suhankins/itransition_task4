import { FormEventHandler, useState } from 'react';
import { getChangeHandler, getSubmitHandler } from './FormHandlers';

export function Login({ onSuccess = () => {} }) {
    const [inputs, setInputs] = useState({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        username: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = getChangeHandler(setInputs, setErrors);

    const handleSubmit: FormEventHandler = getSubmitHandler(
        '/api/users/signin',
        inputs,
        setErrors,
        setLoading,
        onSuccess
    );

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
                type="text"
                name="username"
                placeholder="Username"
                aria-label="Username"
                aria-invalid={errors.username !== '' ? 'true' : undefined}
                autoComplete="nickname"
                value={inputs.username || ''}
                onChange={handleChange}
                required></input>
            <small>
                {errors.username !== '' ? errors.username : undefined}
            </small>

            <label htmlFor="password">Password</label>
            <input
                type="password"
                name="password"
                placeholder="Password"
                aria-label="Password"
                aria-invalid={errors.password !== '' ? 'true' : undefined}
                autoComplete="current-password"
                value={inputs.password || ''}
                onChange={handleChange}
                required></input>
            <small>
                {errors.password !== '' ? errors.password : undefined}
            </small>

            <button
                type="submit"
                className="contrast"
                aria-busy={loading ? 'true' : undefined}
                disabled={loading}>
                Login
            </button>
        </form>
    );
}
