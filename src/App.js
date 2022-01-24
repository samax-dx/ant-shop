import './App.less';

import {useActor, useMachine} from '@xstate/react';
import {capitalize} from "./util"
import React from "react";
import {Login} from "./Login";



export const App = ({ actor }) => {
    const [current, send] = useActor(actor);
    const component = capitalize(current.value);

    /*return (
        <AppLayout render={{ Home, Product, Category, Partner, Rateplan, Party }[component]} actor={actor} />
    );*/
    return <Login/>
};
