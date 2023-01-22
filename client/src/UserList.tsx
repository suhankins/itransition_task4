import { ChangeEvent, useEffect, useState } from 'react';
import { BlockedIcon, BlockIcon, DeleteIcon, LogoutIcon, UnblockIcon } from './Icons';

export function UserList({ onFail = () => {} }) {
    type User = {
        id: string;
        username: string;
        email: string | null;
        date_reg: string;
        date_logged_in: string;
        status: string;
        selected: boolean;
    };

    const [userList, setUserList] = useState([] as User[]);
    const [selectAll, setSelectAll] = useState(false);
    const [anythingSelected, setAnythingSelected] = useState(false);
    const [loading, setLoading] = useState(true);

    async function requestUserList() {
        setLoading(true);
        const rawResponse = await fetch('/api/users/', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        setLoading(false);

        if (rawResponse.status !== 200) {
            onFail();
            return;
        }

        let list: User[] = await rawResponse.json();
        setUserList(list.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
    }

    function timestampToString(value: number | string) {
        if (typeof value == 'string') {
            value = parseInt(value);
            if (isNaN(value)) return 'Unknown';
        }
        return new Date(value).toUTCString();
    }

    function setChecked(id: string, value: boolean) {
        let index = userList.findIndex((user) => user.id === id);
        if (index !== -1) {
            let userListCopy = [...userList];
            userListCopy[index].selected = value;
            setUserList(userListCopy);

            if (userList.every((user) => user.selected)) {
                setSelectAll(true);
            } else {
                setSelectAll(false);
            }
            isAnythingSelected();
        }
    }

    function handleCheckbox(event: ChangeEvent) {
        const target = event.target as HTMLInputElement;

        setChecked(target.name, target.checked);
    }

    function handleSelectAll(event: ChangeEvent) {
        const target = event.target as HTMLInputElement;
        setSelectOnEverything(target.checked);
    }

    function setSelectOnEverything(value: boolean) {
        let userListCopy = userList.map((user) => {
            user.selected = value;
            return user;
        });
        setUserList(userListCopy);
        setSelectAll(value);
        isAnythingSelected();
    }

    function getActionHandler(url: string) {
        return async () => {
            const toBeDeleted: string[] = [];
            userList.forEach((user) => {
                if (user.selected) toBeDeleted.push(user.id);
            });
            setSelectOnEverything(false);
            setLoading(true);
            await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(toBeDeleted),
            });
            setLoading(false);

            await requestUserList();
        };
    }

    const handleDelete = getActionHandler(
        '/api/users/delete'
    );
    const handleBlock = getActionHandler(
        '/api/users/block'
    );
    const handleUnblock = getActionHandler(
        '/api/users/unblock'
    );

    function isAnythingSelected(): boolean {
        const result = userList.some((user) => user.selected);
        setAnythingSelected(result);
        return result;
    }

    useEffect(() => {
        requestUserList();
    }, []);

    return (
        <main className="container">
            <div className="inline">
                <button
                    className="action delete"
                    aria-busy={loading}
                    onClick={handleDelete}
                    disabled={!anythingSelected}>
                    <DeleteIcon />
                    <span>Delete</span>
                </button>
                <button
                    className="action block"
                    aria-busy={loading}
                    onClick={handleBlock}
                    disabled={!anythingSelected}>
                    <BlockIcon />
                    <span>Block</span>
                </button>
                <button
                    className="action unblock"
                    aria-busy={loading}
                    onClick={handleUnblock}
                    disabled={!anythingSelected}>
                    <UnblockIcon />
                    <span>Unblock</span>
                </button>
            </div>

            <a href="/api/users/logout" className="logout">
                <LogoutIcon />
            </a>
            <table>
                <thead>
                    <tr>
                        <th>
                            {loading ? (
                                <div aria-busy={true}></div>
                            ) : (
                                <input
                                    type="checkbox"
                                    name="all"
                                    checked={selectAll}
                                    onChange={handleSelectAll}></input>
                            )}
                        </th>
                        <th scope="col">ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Registered</th>
                        <th scope="col">Last logged in</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((user) => {
                        return (
                            <tr key={user.id}>
                                <td>
                                    {loading ? (
                                        <div aria-busy={true}></div>
                                    ) : (
                                        <input
                                            type="checkbox"
                                            onChange={handleCheckbox}
                                            checked={user.selected ?? false}
                                            name={`${user.id}`}></input>
                                    )}
                                </td>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{timestampToString(user.date_reg)}</td>
                                <td>
                                    {timestampToString(user.date_logged_in)}
                                </td>
                                <td>{user.status === 'blocked' ? <BlockedIcon /> : user.status}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </main>
    );
}
