import { useActor } from "@xstate/react";
import { Menu } from "antd";

export function TopMenu({ actor }) {
    const [appState, sendApp] = useActor(actor);

    return <Menu theme="dark" mode="horizontal" selectedKeys={[appState.value]} style={{direction: "rtl"}}>
        <Menu.Item key="logout" onClick={() => sendApp({ type: 'LOGOUT' })}>Logout</Menu.Item>
        <Menu.Item key="profile" onClick={() => sendApp({ type: 'NAV_PROFILE' })}>Profile</Menu.Item>
    </Menu>;
}
