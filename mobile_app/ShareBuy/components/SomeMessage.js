import { View, Text } from 'react-native';
import { COLORS } from '../constants/theme'

const Message = ({ message }) => {
    return (
        <View>
            <Text
                style={{
                    fontSize: 30,
                    color: COLORS.gray,
                    textAlign: 'center'
                }}>
                {message}
            </Text>
        </View>
    )
}
export default Message;