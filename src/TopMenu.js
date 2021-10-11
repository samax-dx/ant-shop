import {Menu} from "antd";
import React from "react";
import { useMachine } from '@xstate/react';
import { MenuMachine } from './machines/MenuMachine';

export function TopMenu() {
    const [current, send] = useMachine(MenuMachine);
    return <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
        <Menu.Item key="home" onClick={()=>send('NAV_HOME')}>Home</Menu.Item>
        <Menu.Item key="product" onClick={()=>send('NAV_PRODUCT')}>Products</Menu.Item>
        <Menu.Item key="category" onClick={()=>send('NAV_CATEGORY')}>Categories</Menu.Item>
    </Menu>;
}
