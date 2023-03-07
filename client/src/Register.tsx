import { FormEventHandler, useState } from 'react';
import { getChangeHandler, getSubmitHandler } from './FormHandlers';

/**
 * Registration form
 * @returns JSX element
 */
export function Register({ onSuccess = () => {} }) {
    const [inputs, setInputs] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = getChangeHandler(setInputs, setErrors);

    const handleSubmit: FormEventHandler = getSubmitHandler(
        '/api/users/signup',
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
                placeholder="ExampleUser"
                aria-label="Username"
                aria-invalid={errors.username !== '' ? 'true' : undefined}
                autoComplete="nickname"
                value={inputs.username || ''}
                onChange={handleChange}
                required></input>
            <small>
                {errors.username !== '' ? errors.username : undefined}
            </small>

            <label htmlFor="email">Email (Optional)</label>
            <input
                type="email"
                name="email"
                placeholder="user@example.com"
                aria-label="Email"
                aria-invalid={errors.email !== '' ? 'true' : undefined}
                autoComplete="email"
                value={inputs.email || ''}
                onChange={handleChange}></input>
            <small>{errors.email !== '' ? errors.email : undefined}</small>

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

            <label htmlFor="repeatPassword">Repeat password</label>
            <input
                type="password"
                name="repeatPassword"
                placeholder="Repeat password"
                aria-label="Repeat password"
                aria-invalid={errors.repeatPassword !== '' ? 'true' : undefined}
                autoComplete="current-password"
                value={inputs.repeatPassword || ''}
                onChange={handleChange}
                required></input>
            <small>
                {errors.repeatPassword !== ''
                    ? errors.repeatPassword
                    : undefined}
            </small>

            <button
                type="submit"
                className="contrast"
                aria-busy={loading ? 'true' : undefined}
                disabled={loading}>
                Register
            </button>
        </form>
    );
}
