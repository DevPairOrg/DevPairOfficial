import { useState, FormEvent } from 'react';
import { login } from '../../store/session';
import { useModal } from '../../context/Modal/Modal';
import { useAppDispatch } from '../../hooks';
// import './LoginForm.css';

function LoginFormModal() {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<string[]>([]);
    const { closeModal } = useModal();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = await dispatch(login({ email, password }));

        if (data && Array.isArray(data)) {
            setErrors(data);
        } else {
            closeModal();
        }
    };

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label>
                    Email
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit">Log In</button>
            </form>
        </>
    );
}

export default LoginFormModal;
