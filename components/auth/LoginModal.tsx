import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CloseXIcon from "../../public/static/svg/modal/modal_close_x_icon.svg";
import MailIcon from "../../public/static/svg/auth/mail.svg";
import PersonIcon from "../../public/static/svg/auth/person.svg";
import OpenedEyeIcon from "../../public/static/svg/auth/opened-eye.svg";
import ClosedEyeIcon from "../../public/static/svg/auth/closed-eye.svg";
import Button from "../common/Button";
import Input from "../common/Input";
import palette from "../../styles/palette";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import { loginAPI } from "../../lib/api/auth";
import useValidateMode from "../../hooks/useValidateMode";
import { userActions } from "../../store/user";

const Container = styled.div`
    .login-input-wrapper {
        position: relative;
        margin-bottom: 16px;
    }

    .login-password-input-wrapper {
        svg {
            cursor: pointer;
        }
    }

    .login-modal-submit-button-wrapper {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid ${palette.gray_eb};
    }
    .login-modal-set-signup {
        color: ${palette.dark_cyan};
        margin-left: 8px;
        cursor: pointer;
    }
`;

interface IProps {
    closeModal: () => void;
}

const LoginModal: React.FC<IProps> = ({ closeModal }) => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isPasswordHided, setIsPasswordHided] = useState(true);

    const { validateMode, setValidateMode } = useValidateMode();

    const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const togglePasswordHiding = () => {
        setIsPasswordHided(!isPasswordHided);
    };

    const onSubmitLogin = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setValidateMode(true);
        if(!email || !password) {
            alert("이메일과 비밀번호를 입력해주세요.")
        } else {
            const loginBody = { email, password };

            try {
                const { data } = await loginAPI(loginBody);
                dispatch(userActions.setLoggedUser(data));
                closeModal();
                // console.log(data);
            } catch(e) {
                console.log(e);
            }
        }
    };

    useEffect(() => {
        return () => {
          setValidateMode(false);
        };
    }, []);
    
    return (
        <Container>
            <form onSubmit={onSubmitLogin}>
                <div className="login-input-wrapper">
                    <Input 
                        placeholder="이메일 주소"
                        name="email"
                        type="email"
                        icon={<MailIcon />}
                        value={email}
                        isValid={email !== ""}
                        errorMessage="이메일을 입력해주세요."
                        onChange={onChangeEmail}
                    />
                </div>
                <div className="login-input-wrapper login-password-input-wrapper">
                    <Input 
                        placeholder="비밀번호 입력"
                        icon={isPasswordHided ? (<ClosedEyeIcon onClick={togglePasswordHiding}/>) : (<OpenedEyeIcon onClick={togglePasswordHiding}/>)}
                        type={isPasswordHided ? "password" : "text"}
                        value={password}
                        isValid={password !== ""}
                        errorMessage="비밀번호를 입력하세요."
                        onChange={onChangePassword}
                    />
                </div>
                <div className="login-modal-submit-button-wrapper">
                    <Button type="submit" color="bittersweet">로그인</Button>
                </div>
                <p>
                    계정이 없으신가요?
                    <span 
                        className="login-modal-set-signup"
                        role="presentation"
                        onClick={() => dispatch(authActions.setAuthMode("signup"))}
                    >
                        회원가입
                    </span>
                </p>
            </form>
            
        </Container>
    );
};

export default LoginModal;

