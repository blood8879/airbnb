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

//* ????????? ??? ?????? ??? option
const disabledMoths = ["???", ...monthList];
//* ????????? ??? ?????? ??? option
const disabledDays = ["???", ...dayList];
//* ????????? ??? ?????? ??? option
const disabledYears = ["???", ...yearList];

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

    // ???????????? ?????? or ???????????? ?????? ????????????
    const isPasswordHasNameOrEmail = useMemo(
        () =>
            !password ||
            !lastname ||
            password.includes(lastname) ||
            password.includes(email.split("@")[0]),
        [password, lastname, email]
    );

    // ???????????? ?????? ????????? ??????
    const isPasswordOverMinLength = useMemo(
        () => !!password && password.length >= PASSWORD_MIN_LENGTH,
        [password]
    );

    // ???????????? ????????? ???????????? ???????????? ??????
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
                        `${birthYear}-${birthMonth!.replace("???", "")}-${birthDay}`
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
                    <Input placeholder="????????? ??????" type="email" name="email" icon={<MailIcon />} value={email} onChange={onChangeEmail} isValid={!!email} useValidation={validateMode} errorMessage="???????????? ???????????????." />
                </div>
                <div className="sign-up-input-wrapper">
                    <Input placeholder="???(???:???)" icon={<PersonIcon />} value={lastname} onChange={onChangeLastname} useValidation={validateMode} isValid={!!lastname} errorMessage="?????? ???????????????." />
                </div>
                <div className="sign-up-input-wrapper">
                    <Input placeholder="??????(???: ??????)" icon={<PersonIcon />} value={firstname} onChange={onChangeFirstname} useValidation={validateMode} isValid={!!firstname} errorMessage="????????? ???????????????" />
                </div>
                <div className="sign-up-input-wrapper">
                    <Input placeholder="???????????? ????????????" type={ hidePassword ? "password" : "text" } icon={ hidePassword ? (<ClosedEyeIconIcon onClick={toggleHidePassword}/>) : (<OpenedEyeIcon onClick={toggleHidePassword} />)} value={password} onChange={onChangePassword} onFocus={onFocusPassword} useValidation={validateMode} 
                    isValid={!isPasswordHasNameOrEmail && isPasswordOverMinLength && !isPasswordHasNumberOrSymbol} errorMessage="??????????????? ???????????????." />
                </div>
                {passwordFocused && (
                    <>
                        <PasswordWarning isValid={isPasswordHasNameOrEmail} text="??????????????? ?????? ???????????? ????????? ????????? ????????? ??? ????????????." />
                        <PasswordWarning isValid={!isPasswordOverMinLength} text="??????????????? ?????? 8??? ??????????????? ?????????." />
                        <PasswordWarning isValid={!isPasswordHasNumberOrSymbol} text="????????? ??????????????? ???????????????." />
                    </>
                )}
                <p className="sign-up-birthday-label">??????</p>
                <p className="sign-up-modal-birthday-info">??? 18??? ????????? ????????? ???????????? ????????? ??? ????????????. ????????? ?????? ??????????????? ??????????????? ???????????? ????????????.</p>
                <div className="sign-up-modal-birthday-selectors">
                    <div className="sign-up-modal-birthday-month-selector">
                        <Selector 
                            options={monthList} 
                            disabledOptions={disabledMoths} 
                            defaultValue="???" 
                            value={birthMonth}
                            onChange={(e) => setbirthMonth(e.target.value)}
                            isValid={!!birthMonth}
                        />
                    </div>
                    <div className="sign-up-modal-birthday-day-selector">
                        <Selector 
                            options={dayList} 
                            disabledOptions={["???", ...dayList]} 
                            defaultValue="???" 
                            value={birthDay}
                            onChange={(e) => setbirthDay(e.target.value)}
                            isValid={!!birthDay}
                        />
                    </div>
                    <div className="sign-up-modal-birthday-year-selector">
                        <Selector 
                            options={yearList} 
                            disabledOptions={["???", ...yearList]} 
                            defaultValue="???" 
                            value={birthYear}
                            onChange={(e) => setbirthYear(e.target.value)}
                            isValid={!!birthYear}
                        />
                    </div>
                </div>
                <div className="sign-up-modal-submit-button-wrapper">
                    <Button type="submit" color="bittersweet">????????????</Button>
                </div>
                <p>
                    ?????? ??????????????? ????????? ??????????
                    <span
                        className="sign-up-modal-set-login"
                        role="presentation"
                        onClick={() => dispatch(authActions.setAuthMode("login"))}
                    >
                        ?????????
                    </span>
                </p>
            </form>
        </Container>
    )
};

export default SignUpModal;