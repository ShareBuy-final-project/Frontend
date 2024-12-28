import { getToken } from "../utils/userTokens";
import { Text, View } from "react-native";
const home = () => {
    const user = getToken('email');
    return(
        <View>
            <Text>Home</Text>
            <Text>Hello {user}</Text>
        </View>
    )
}
export default home;