import * as React from "react";
import { StyleSheet, Text, View, Pressable, Image, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, ParamListBase } from "@react-navigation/native";

const Panic = () => {
    const navigation = useNavigation();

    // Contact information for different fraud types
    const emergencyContacts = {
        cardFraud: {
            phone: "1800-425-3800",
            email: "fraud@bankhelp.com"
        },
        upiCardFraud: {
            phone: "1800-120-1740", 
            email: "cyber@npci.org.in"
        },
        otpScam: {
            phone: "1930",
            email: "complaints@cybercrime.gov.in"
        },
        accountAccess: {
            phone: "1800-425-0000",
            email: "support@bankhelp.com"
        }
    };

    // Function to make phone calls - Fixed version
    const makePhoneCall = (phoneNumber) => {
        const phoneUrl = `tel:${phoneNumber}`;
        Linking.openURL(phoneUrl)
            .catch((err) => {
                console.error('Phone call error:', err);
                Alert.alert(
                    "Call Failed",
                    `Unable to make call. Please dial ${phoneNumber} manually.`,
                    [{ text: "OK" }]
                );
            });
    };

    // Function to send email - Fixed version
    const sendEmail = (email, subject) => {
        const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
        Linking.openURL(emailUrl)
            .catch((err) => {
                console.error('Email error:', err);
                Alert.alert(
                    "Email Failed", 
                    `Unable to open email app. Please email ${email} manually.`,
                    [{ text: "OK" }]
                );
            });
    };

    // Function to show contact options for each card
    const showContactOptions = (contactType, title) => {
        const contact = emergencyContacts[contactType];
        Alert.alert(
            `${title} Help`,
            "Choose how you want to get help:",
            [
                {
                    text: `📞 Call ${contact.phone}`,
                    onPress: () => makePhoneCall(contact.phone)
                },
                {
                    text: `📧 Email ${contact.email}`,
                    onPress: () => sendEmail(contact.email, `URGENT: ${title} Emergency Report`)
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    // Emergency call function (for the main red button)
    const handleEmergencyCall = () => {
        Alert.alert(
            "Emergency Contact",
            "Choose your emergency contact:",
            [
                {
                    text: "🚔 Police (100)",
                    onPress: () => makePhoneCall("100"),
                    style: "destructive"
                },
                {
                    text: "🛡️ Cyber Crime (1930)", 
                    onPress: () => makePhoneCall("1930")
                },
                {
                    text: "🏦 Bank Fraud Helpline",
                    onPress: () => makePhoneCall("1800-425-3800")
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Panic Mode Active</Text>
                <Pressable style={styles.notificationButton}>
                    <Text style={styles.notificationIcon}>🔔</Text>
                </Pressable>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Emergency Call Button */}
                <View style={styles.emergencySection}>
                    <Pressable 
                        style={styles.emergencyButton}
                        onPress={handleEmergencyCall}
                    >
                        <Text style={styles.tapToCall}>Tap to call</Text>
                        <Text style={styles.emergencyText}>Emergency Help</Text>
                    </Pressable>
                </View>

                {/* Options Grid */}
                <View style={styles.optionsGrid}>
                    {/* First Row */}
                    <View style={styles.optionRow}>
                        <Pressable 
                            style={styles.optionCard}
                            onPress={() => showContactOptions('cardFraud', 'Card Fraud')}
                        >
                            <Image 
                                style={styles.optionIcon} 
                                source={require("../../../assets/Card-Payment.png")} 
                                resizeMode="contain"
                            />
                            <Text style={styles.optionText}>Card{'\n'}Fraud</Text>
                            <Text style={styles.contactInfo}>📞 1800-425-3800</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.optionCard}
                            onPress={() => showContactOptions('upiCardFraud', 'UPI/Card Fraud')}
                        >
                            <Image 
                                style={styles.optionIcon} 
                                source={require("../../../assets/QrCode.png")} 
                                resizeMode="contain"
                            />
                            <Text style={styles.optionText}>Card/UPI{'\n'}fraud</Text>
                            <Text style={styles.contactInfo}>📞 1800-120-1740</Text>
                        </Pressable>
                    </View>

                    {/* Second Row */}
                    <View style={styles.optionRow}>
                        <Pressable 
                            style={styles.optionCard}
                            onPress={() => showContactOptions('otpScam', 'OTP/Call Scam')}
                        >
                            <Image 
                                style={styles.optionIcon} 
                                source={require("../../../assets/OneTimePassword.png")} 
                                resizeMode="contain"
                            />
                            <Text style={styles.optionText}>OTP/Call{'\n'}Scam</Text>
                            <Text style={styles.contactInfo}>📞 1930</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.optionCard}
                            onPress={() => showContactOptions('accountAccess', 'Account Access Issue')}
                        >
                            <Image 
                                style={styles.optionIcon} 
                                source={require("../../../assets/Merchant-Account.png")} 
                                resizeMode="contain"
                            />
                            <Text style={styles.optionText}>Account Access{'\n'}Issue</Text>
                            <Text style={styles.contactInfo}>📞 1800-425-0000</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#d01f00",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    backArrow: {
        fontSize: 24,
        color: "#ffffff",
        fontWeight: "bold",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#ffffff",
        textTransform: "capitalize",
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
    },
    notificationIcon: {
        fontSize: 16,
    },
    content: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: 20,
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    emergencySection: {
        alignItems: "center",
        marginBottom: 60,
    },
    emergencyButton: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: "#d01f00",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        borderColor: "#ffffff",
    },
    tapToCall: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
        textAlign: "center",
    },
    emergencyText: {
        fontSize: 12,
        color: "#ffffff",
        textAlign: "center",
        marginTop: 5,
    },
    optionsGrid: {
        flex: 1,
    },
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    optionCard: {
        width: "47%",
        height: 160,
        backgroundColor: "#e8f5e9",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    optionIcon: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    optionText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#000000",
        textAlign: "center",
        textTransform: "capitalize",
        lineHeight: 18,
        marginBottom: 8,
    },
    contactInfo: {
        fontSize: 10,
        color: "#666666",
        textAlign: "center",
        fontWeight: "400",
    },
});

export default Panic;