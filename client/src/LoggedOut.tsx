import { useState } from 'react';

import { Login } from './Login';
import { Register } from './Register';

export function LoggedOut({ onSuccess = () => {} }) {
    type State = 'login' | 'register';
    const [state, setState] = useState('login' as State);

    function switchState() {
        if (isLogin()) {
            setState('register');
        } else {
            setState('login');
        }
    }

    function isLogin() {
        return state === 'login';
    }

    return (
        <main className="container">
            <article className="grid">
                <div>
                    <hgroup>
                        <h1>Sign {isLogin() ? 'in' : 'up'}</h1>
                        <h2 className="serbia"></h2>
                    </hgroup>
                    {isLogin() ? (
                        <Login onSuccess={onSuccess} />
                    ) : (
                        <Register onSuccess={onSuccess} />
                    )}
                    <div>
                        <span>
                            {isLogin()
                                ? `Don't have an account?`
                                : 'Have an account already?'}
                        </span>
                        <button onClick={switchState} className="secondary">
                            {isLogin() ? 'Register' : 'Login'}
                        </button>
                    </div>
                </div>
                <div></div>
            </article>
        </main>
    );
}
