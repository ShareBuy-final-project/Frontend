import { ScrollView, Text, StyleSheet } from 'react-native';

const TermsOfUse = () => {
    return (
        <ScrollView>
            <Text style={styles.heading}>Terms of Use - Payment Policy</Text>
            <Text style={styles.paragraph}>
                1. <Text style={styles.bold}>Payment Gateway:</Text> Our platform utilizes 
                <Text style={styles.italic}> Stripe </Text> as a third-party payment processor 
                to facilitate transactions securely. When you make a payment, you are authorizing 
                Stripe to process the payment on behalf of the intended group or business.
            </Text>
            <Text style={styles.paragraph}>
                2. <Text style={styles.bold}>Conditional Payment Authorization:</Text> Payments made 
                for group purchases are <Text style={styles.italic}>authorized only</Text> and will not be 
                immediately transferred to the group or business. Funds will be held securely and will 
                only be transferred if the group reaches its specified capacity goal before the stated deadline.
            </Text>
            <Text style={styles.paragraph}>
                3. <Text style={styles.bold}>Refund Policy:</Text> If the group fails to meet its capacity goal 
                by the deadline, the payment authorization will be canceled, and no funds will be transferred. 
                Your payment method will not be charged in this case.
            </Text>
            <Text style={styles.paragraph}>
                4. <Text style={styles.bold}>No Financial Liability:</Text> Our platform does not handle, process, 
                or store your payment information. All payment-related actions are securely managed by Stripe 
                in compliance with their terms and policies.
            </Text>
            <Text style={styles.paragraph}>
                5. <Text style={styles.bold}>Acknowledgment and Agreement:</Text> By initiating a payment through 
                our platform, you acknowledge and agree to the terms outlined above, including the use of Stripe 
                as our payment gateway and the conditional nature of the transaction.
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 14,
        marginBottom: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
    italic: {
        fontStyle: 'italic',
    },
    checkboxContainer: {
        flexDirection: 'row',
        margin: 20,
        alignItems: 'center',
    },
    label: {
        marginLeft: 8,
    },
});

export default TermsOfUse; // Ensure default export