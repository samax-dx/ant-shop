import { useActor } from "@xstate/react";
import { Menu } from "antd";

export function TopMenu({ actor }) {
    const [appState, sendApp] = useActor(actor);

    return <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]} style={{direction: "rtl"}}>
        <Menu.Item key="party" onClick={() => sendApp({ type: 'NAV_PARTY' })}>Party</Menu.Item>
        <Menu.Item key="rateplan" onClick={() => sendApp({ type: 'NAV_RATEPLAN' })}>Rate Plan</Menu.Item>
        <Menu.Item key="partners" onClick={() => sendApp({ type: 'NAV_PARTNER' })}>Partners</Menu.Item>
        <Menu.Item key="category" onClick={() => sendApp({ type: 'NAV_CATEGORY' })}>Categories</Menu.Item>
        <Menu.Item key="product" onClick={() => sendApp({ type: 'NAV_PRODUCT' })}>Products</Menu.Item>
        <Menu.Item key="home" onClick={() => sendApp({ type: 'NAV_HOME' })}>Home</Menu.Item>
    </Menu>;
}
