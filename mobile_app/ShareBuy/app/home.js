import { getToken } from "../utils/userTokens";
import { Text } from "react-native";
const home = () => {
    const user = getToken('email');
    return 
        <view>
            <Text>Home</Text>
            <Text>Hello {user}</Text>
        </view>
}
export default home;