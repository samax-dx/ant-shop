import { Menu } from "antd";
import React from "react";
import { useActor } from '@xstate/react';
import { menuMachine } from './machines/menuMachine';

export function TopMenu() {
    const [current, send] = useActor(menuMachine);

    return <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
        <Menu.Item key="home" onClick={() => send({ type: 'NAV_HOME' })}>Home</Menu.Item>
        <Menu.Item key="product" onClick={() => send({ type: 'NAV_PRODUCT' })}>Products</Menu.Item>
        <Menu.Item key="category" onClick={() => send({ type: 'NAV_CATEGORY' })}>Categories</Menu.Item>
    </Menu>;
}
