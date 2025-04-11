import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import "./Login.css"; // Reutilizando o mesmo CSS do Login

function Register({ handleLogin }) {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // success | error
    const [showPassword, setShowPassword] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false); // Estado para o modal
    const navigate = useNavigate(); 
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessageType('error');
            setMessage("As senhas não coincidem!");
            return;
        }

        if (!termsAccepted) {
            setMessageType('error');
            setMessage("Você deve aceitar os termos de uso!");
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setMessageType('success');
                setMessage("Usuário registrado com sucesso!");
                setTimeout(() => {
                    handleLogin({ userName, email, id_usuario: data.id_usuario }); // Chama handleLogin com dados do usuário
                    navigate('/'); // Redireciona para a página principal
                }, 1500);
            } else {
                setMessageType('error');
                setMessage(data.error || "Erro ao registrar.");
            }
        } catch (error) {
            setMessageType('error');
            setMessage("Erro ao conectar com o servidor. Tente novamente.");
        }
    };

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form id="register-form" className="login-form" autoComplete="off" role="main" onSubmit={handleSubmit}>
            <h1 className="a11y-hidden">Register Form</h1>

            {/* Campo de nome de usuário */}
            <div>
                <label className="label-userName">
                    <input 
                        type="text" 
                        className="text" 
                        name="userName" 
                        placeholder="Nome de Usuário" 
                        tabIndex={1} 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)} 
                        required 
                    />
                    <span className="required">Nome de Usuário</span>
                </label>
            </div>

            <div>
                <label className="label-email">
                    <input 
                        type="email" 
                        className="text" 
                        name="email" 
                        placeholder="Email" 
                        tabIndex={2} 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <span className="required">Email</span>
                </label>
            </div>

            <div>
                <label className="label-password">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        className="text" 
                        name="password" 
                        placeholder="Senha" 
                        tabIndex={3} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <span className="required">Senha</span>
                </label>
            </div>

            <div>
                <label className="label-password">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        className="text" 
                        name="confirmPassword" 
                        placeholder="Confirmar Senha" 
                        tabIndex={4} 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                    <span className="required">Confirmar Senha</span>
                </label>
            </div>

            {/* Checkbox para mostrar/ocultar a senha */}
            <input
                type="checkbox"
                name="show-password"
                className="show-password a11y-hidden"
                id="show-password"
                tabIndex="3"
                onChange={handlePasswordToggle} // Chama a função para alternar
            />
            <label className="label-show-password" htmlFor="show-password">
                <span>Mostrar senha</span>
            </label>

            {/* Checkbox para aceitar os termos de uso (Agora abaixo do "Mostrar Senha") */}
            <div>
            <input
                type="checkbox"
                name="accept-terms"
                className="accept-terms a11y-hidden"
                id="accept-terms"
                tabIndex={6}
                checked={termsAccepted}
                onChange={(e) => {
                    setTermsAccepted(!termsAccepted);
                }}
            />
                <label className="label-accept-terms" htmlFor="accept-terms">
                    <span>Aceito os <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>Termos de Uso</a></span>
                </label>
            </div>

            <input type="submit" value="Criar conta" />

            {message && <p className={messageType}>{message}</p>}

            {/* Modal para Termos de Uso */}
            {showTermsModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Termos de Uso</h2>
                        <p>Os termos são os seguintes...</p>
                        <button onClick={() => setShowTermsModal(false)}>Fechar</button>
                    </div>
                </div>
            )}

            <figure aria-hidden="true">
                <div className="person-body"></div>
                <div className="neck skin"></div>
                <div className="head skin">
                    <div className="eyes"></div>
                    <div className="mouth"></div>
                </div>
                <div className="hair"></div>
                <div className="ears"></div>
                <div className="shirt-1"></div>
                <div className="shirt-2"></div>
            </figure>
        </form>
    );
}

export default Register;
