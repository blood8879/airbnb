import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CloseXIcon from "../../public/static/svg/modal/modal_close_x_icon.svg";
import MailIcon from "../../public/static/svg/auth/mail.svg";
import PersonIcon from "../../public/static/svg/auth/person.svg";
import OpenedEyeIcon from "../../public/static/svg/auth/opened-eye.svg";
import ClosedEyeIconIcon from "../../public/static/svg/auth/closed-eye.svg";
import Input from "../common/Input";
import palette from "../../styles/palette";
import Selector from "../common/Selector";
import { monthList, dayList, yearList } from "../../lib/staticData"
import Button from "../common/Button";
import { signupAPI } from "../../lib/api/auth";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/user";
import useValidateMode from "../../hooks/useValidateMode";
import { useMemo } from "react";
import PasswordWarning from "./PasswordWarning";
import { authActions } from "../../store/auth";

const Container = styled.div`
    .sign-up-input-wrapper {
        position: relative;
        margin-bottom: 16px;
    }

    .sign-up-password-input-wrapper {
        svg {
            cursor: pointer;
        }
    }

    .sign-up-birthday-label {
        font-size: 16px;
        font-weight: 600;
        margin-top: 16px;margin-bottom: 8px;
    }
    
    .sign-up-modal-birthday-info {
        margin-bottom: 16px;
        color: ${palette.charcoal};     
    }

    .sign-up-modal-birthday-selectors {
        display: flex;
        margin-bottom: 24px;
        .sign-up-modal-birthday-month-selector {
            margin-right: 16px;
            flex-grow: 1;
        }
        .sign-up-modal-birthday-day-selector {
            margin-right: 16px;
            width: 25%;
        }
        .sign-up-modal-birthday-year-selector {
            width: 33.3333%;
        }
    }

    .sign-up-modal-submit-button-wrapper {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid ${palette.gray_eb};
    }

    .sign-up-modal-set-login {
        color: ${palette.dark_cyan};
        margin-left: 8px;
        cursor: pointer;
    }
`;

const PASSWORD_MIN_LENGTH = 8;

interface IProps {
    closeModal: () => void;
}

//* 선택할 수 없는 월 option
const disabledMoths = ["월", ...monthList];
//* 선택할 수 없는 일 option
const disabledDays = ["일", ...dayList];
//* 선택할 수 없는 년 option
const disabledYears = ["년", ...yearList];

const SignUpModal: React.FC<IProps> = ({ closeModal }) => {
    const [email, setEmail] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);
    const [birthYear, setbirthYear] = useState<string | undefined>();
    const [birthDay, setbirthDay] = useState<string | undefined>();
    const [birthMonth, setbirthMonth] = useState<string | undefined>();
    const [passwordFocused, setPasswordFocused] = useState(false);

    const dispatch = useDispatch();
    const { validateMode, setValidateMode } = useValidateMode();

    const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const onChangeLastname = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastname(event.target.value);
    };

    const onChangeFirstname = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstname(event.target.value);
    };

    const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const toggleHidePassword = () => {
        setHidePassword(!hidePassword);
    };

    const onFocusPassword = () => {
        setPasswordFocused(true);
    };

    // 비밀번호 이름 or 비밀번호 포함 여부체크
    const isPasswordHasNameOrEmail = useMemo(
        () =>
            !password ||
            !lastname ||
            password.includes(lastname) ||
            password.includes(email.split("@")[0]),
        [password, lastname, email]
    );

    // 비밀번호 최소 자리수 체크
    const isPasswordOverMinLength = useMemo(
        () => !!password && password.length >= PASSWORD_MIN_LENGTH,
        [password]
    );

    // 비밀번호 숫자나 특수기호 포함여부 체크
    const isPasswordHasNumberOrSymbol = useMemo(
        () =>
            /[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"]/g.test(password) ||
            /[0-9]/g.test(password),
        [password]
    );

    const validateSignUpForm = () => {
        if (!email) {
          return false;
        }
        if (!lastname) {
          return false;
        }
        if (!firstname) {
          return false;
        }
        if (!birthMonth) {
          return false;
        }
        if (!birthDay) {
          return false;
        }
        if (!birthYear) {
          return false;
        }
        if (
          !password ||
          isPasswordHasNameOrEmail ||
        //   !isPasswordHasNumberOrSymbol ||
          !isPasswordOverMinLength
        ) {
          return false;
        }
        return true;
      };

    const onSubmitSignUp = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setValidateMode(true);

        if(validateSignUpForm()) {
            try {
                const signUpBody = {
                    email,
                    lastname,
                    firstname,
                    password,
                    birthday: new Date(
                        `${birthYear}-${birthMonth!.replace("월", "")}-${birthDay}`
                    ).toISOString(),
                };
                // await signupAPI(signUpBody);
                const { data } = await signupAPI(signUpBody);
                dispatch(userActions.setLoggedUser(data));
                closeModal();
            } catch(e) {
                console.log(e);
            }
        }
        
    };

    useEffect(() => {
        setValidateMode(false);
    }, []);

    return (
        <Container>
            <form onSubmit={onSubmitSignUp}>
                <div className="sign-up-input-wrapper">
                    <Input placeholder="이메일 주소" type="email" name="email" icon={<MailIcon />} value={email} onChange={onChangeEmail} isValid={!!email} useValidation={validateMode} errorMessage="이메일이 필요합니다." />
                </div>
                <div className="sign-up-input-wrapper">
                    <Input placeholder="성(예:홍)" icon={<PersonIcon />} value={lastname} onChange={onChangeLastname} useValidation={validateMode} isValid={!!lastname} errorMessage="성을 입력하세요." />
                </div>
                <div className="sign-up-input-wrapper">
                    <Input placeholder="이름(예: 길동)" icon={<PersonIcon />} value={firstname} onChange={onChangeFirstname} useValidation={validateMode} isValid={!!firstname} errorMessage="이름을 입력하세요" />
                </div>
                <div className="sign-up-input-wrapper">
                    <Input placeholder="비밀번호 설정하기" type={ hidePassword ? "password" : "text" } icon={ hidePassword ? (<ClosedEyeIconIcon onClick={toggleHidePassword}/>) : (<OpenedEyeIcon onClick={toggleHidePassword} />)} value={password} onChange={onChangePassword} onFocus={onFocusPassword} useValidation={validateMode} 
                    isValid={!isPasswordHasNameOrEmail && isPasswordOverMinLength && !isPasswordHasNumberOrSymbol} errorMessage="비밀번호를 입력하세요." />
                </div>
                {passwordFocused && (
                    <>
                        <PasswordWarning isValid={isPasswordHasNameOrEmail} text="비밀번호에 본인 이름이나 이메일 주소를 포함할 수 없습니다." />
                        <PasswordWarning isValid={!isPasswordOverMinLength} text="비밀번호는 최소 8자 이상이어야 합니다." />
                        <PasswordWarning isValid={!isPasswordHasNumberOrSymbol} text="숫자나 특수문자를 포함하세요." />
                    </>
                )}
                <p className="sign-up-birthday-label">생일</p>
                <p className="sign-up-modal-birthday-info">만 18세 이상의 성인만 회원으로 가입할 수 있습니다. 생일은 다른 에어비앤비 이용자에게 공개되지 않습니다.</p>
                <div className="sign-up-modal-birthday-selectors">
                    <div className="sign-up-modal-birthday-month-selector">
                        <Selector 
                            options={monthList} 
                            disabledOptions={disabledMoths} 
                            defaultValue="월" 
                            value={birthMonth}
                            onChange={(e) => setbirthMonth(e.target.value)}
                            isValid={!!birthMonth}
                        />
                    </div>
                    <div className="sign-up-modal-birthday-day-selector">
                        <Selector 
                            options={dayList} 
                            disabledOptions={["일", ...dayList]} 
                            defaultValue="일" 
                            value={birthDay}
                            onChange={(e) => setbirthDay(e.target.value)}
                            isValid={!!birthDay}
                        />
                    </div>
                    <div className="sign-up-modal-birthday-year-selector">
                        <Selector 
                            options={yearList} 
                            disabledOptions={["년", ...yearList]} 
                            defaultValue="년" 
                            value={birthYear}
                            onChange={(e) => setbirthYear(e.target.value)}
                            isValid={!!birthYear}
                        />
                    </div>
                </div>
                <div className="sign-up-modal-submit-button-wrapper">
                    <Button type="submit" color="bittersweet">가입하기</Button>
                </div>
                <p>
                    이미 에어비앤비 계정이 있나요?
                    <span
                        className="sign-up-modal-set-login"
                        role="presentation"
                        onClick={() => dispatch(authActions.setAuthMode("login"))}
                    >
                        로그인
                    </span>
                </p>
            </form>
        </Container>
    )
};

export default SignUpModal;