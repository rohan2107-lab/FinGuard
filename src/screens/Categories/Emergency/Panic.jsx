import * as React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, ParamListBase } from "@react-navigation/native";

const Panic = () => {
    const navigation = useNavigation();

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
                    <View style={styles.emergencyButton}>
                        <Text style={styles.tapToCall}>Tap to call</Text>
                    </View>
                </View>

                {/* Options Grid */}
                <View style={styles.optionsGrid}>
                    {/* First Row */}
                    <View style={styles.optionRow}>
                        <Pressable style={styles.optionCard}>
                            <Image 
                                style={styles.optionIcon} 
                                source={require("../../../assets/Card-Payment.png")} 
                                resizeMode="contain"
                            />
                            <Text style={styles.optionText}>Card{'\n'}Fraud</Text>
                        </Pressable>
                        
                        <Pressable style={styles.optionCard}>
                            <Image 
                                style={styles.optionIcon} 
                                source={require("../../../assets/QrCode.png")} 
                                resizeMode="contain"
                            />
                            <Text style={styles.optionText}>Card/UPI{'\n'}fraud</Text>
                        </Pressable>
                    </View>

                    {/* Second Row */}
                    <View style={styles.optionRow}>
                        <Pressable style={styles.optionCard}>
                            <Image 
                                style={styles.optionIcon} 
                                source={require("../../../assets/OneTimePassword.png")} 
                                resizeMode="contain"
                            />
                            <Text style={styles.optionText}>OTP/Call{'\n'}Scam</Text>
                        </Pressable>
                        
                        <Pressable style={styles.optionCard}>
                            <Image 
                                style={styles.optionIcon} 
                                source={require("../../../assets/Merchant-Account.png")} 
                                resizeMode="contain"
                            />
                            <Text style={styles.optionText}>Account Access{'\n'}Issue</Text>
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
        height: 140,
        backgroundColor: "#e8f5e9",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
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
    },
});

export default Panic;