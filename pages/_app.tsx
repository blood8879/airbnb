import App, { AppContext, AppInitialProps, AppProps } from "next/app";
import GlobalStyle from "../styles/GlobalStyle";
import Header from "../components/Header";
import { useSelector, wrapper } from "../store";
import { cookieStringToObject } from "../lib/utils";
import axios from "../lib/api";
import { meAPI } from "../lib/api/auth";
import { userActions } from "../store/user";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const app = ({ Component, pageProps }: AppProps) => {
    const user = useSelector((state) => state.user);
    return (
        <>
            <Header />
            <GlobalStyle />
            <Component {...pageProps}/>
            <div id="root-modal" />
        </>
    );
};



app.getInitialProps = async (context: AppContext) => {
    const appInitialProps = await App.getInitialProps(context);
    const cookieObject = cookieStringToObject(context.ctx.req?.headers.cookie);
    const { store } = context.ctx;
    const { isLogged } = store.getState().user;
    // console.log("context", context)
    // console.log("cookieObject", cookieObject.access_token)
    // console.log("AppContext", context)
    // console.log("isLogged",isLogged)
    // console.log("user", store.getState().user)
    try {
        if(!isLogged && cookieObject.access_token) {
            // console.log("defaultToken", axios.defaults.headers.cookie)
            axios.defaults.headers.cookie = cookieObject.access_token;
            const { data } = await meAPI();
            // console.log(data);
            store.dispatch(userActions.setLoggedUser(data));
        } 
    } catch(e) {
        // console.log(e.data);
    }
    
    return { ...appInitialProps };
};

export default wrapper.withRedux(app);