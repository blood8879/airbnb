import { useRouter } from "next/router";
import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import CloseXIcon from "../public/static/svg/modal/modal_close_x_icon.svg";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top:0;
    left: 0;
    z-index: 11;
    .modal-background {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        z-index: 10;
    }
    .modal-contents {
        width: 568px;
        min-height: 614px;
        padding: 32px;
        background-color: white;
        z-index: 11;
        .modal-close-x-icon {
            cursor: pointer;
            display: block;
            margin: 0 0 40px auto;
        }
    }
`
const useModal = () => {
    const [modalOpened, setModalOpened] = useState(false);

    const openModal = () => {
        setModalOpened(true);
    };

    const closeModal = () => {
        setModalOpened(false);
    };

    interface IProps {
        children: React.ReactNode;
    }
    
    const router = useRouter();
    useEffect(() => {
        return() => {
            closeModal();
        };
    }, [router]);

    const ModalPortal: React.FC<IProps> = ({ children }) => {
        const ref = useRef<Element | null>();
        const [mounted, setMounted] = useState(false);

        useEffect(() => {
            setMounted(true);
            if (document) {
                const dom = document.querySelector("#root-modal");
                ref.current = dom;
            }
        }, []);

        if (ref.current && mounted && modalOpened) {
            return createPortal(
                <Container>
                    <div 
                        className="modal-background"
                        role="presentation"
                        onClick={closeModal}
                    />
                    <div className="modal-contents">
                        <CloseXIcon 
                            className="modal-close-x-icon"
                            onClick={closeModal}
                        />
                        {children}
                    </div>
                    
                </Container>,
                ref.current
            );
        }
        return null;
    };

    return {
        openModal,
        closeModal,
        ModalPortal: React.memo(ModalPortal),
    };
};

export default useModal;