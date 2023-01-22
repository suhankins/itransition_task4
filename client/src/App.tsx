import { useEffect, useState } from 'react';
import { LoggedOut } from './LoggedOut';
import { UserList } from './UserList';

export function App() {
    type State = 'loading' | 'loggedOut' | 'loggedIn' | 'error';
    const [state, setState] = useState('loading' as State);

    const states = {
        loading: <main className="container" aria-busy="true"></main>,
        loggedOut: <LoggedOut onSuccess={requestUserList} />,
        loggedIn: <UserList onFail={requestUserList} />,
        error: <main className="container">Something went wrong</main>
    };

    function requestUserList() {
        setState('loading');
        fetch('/api/users/', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((rawResponse) => {
                if (rawResponse.status === 200 || rawResponse.status === 304) {
                    setState('loggedIn');
                } else if (rawResponse.status === 401) {
                    setState('loggedOut');
                }
            })
            .catch(() => {
                setState('error');
            });
    }

    useEffect(() => {
        requestUserList();
    }, []);

    return <>{states[state]}</>;
}
