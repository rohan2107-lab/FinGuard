import * as React from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const HelplineDialer = () => {
    const navigation = useNavigation();

    const emergencyNumbers = [
        {
            id: 1,
            title: "Police",
            number: "100",
            icon: "👮",
            description: "Emergency Police Service",
            available: "24/7"
        },
        {
            id: 2,
            title: "Fire Service",
            number: "101",
            icon: "🚒",
            description: "Fire Emergency Service",
            available: "24/7"
        },
        {
            id: 3,
            title: "Ambulance",
            number: "108",
            icon: "🚑",
            description: "Medical Emergency",
            available: "24/7"
        },
        {
            id: 4,
            title: "Disaster Mgmt",
            number: "1078",
            icon: "🆘",
            description: "Disaster Management",
            available: "24/7"
        }
    ];

    const bankHelplines = [
        {
            id: 5,
            title: "Customer Care",
            number: "1800-123-4567",
            icon: "📞",
            description: "General Banking Support",
            available: "24/7"
        },
        {
            id: 6,
            title: "Credit Card",
            number: "1800-234-5678",
            icon: "💳",
            description: "Credit Card Support",
            available: "24/7"
        },
        {
            id: 7,
            title: "Net Banking",
            number: "1800-345-6789",
            icon: "💻",
            description: "Online Banking Help",
            available: "Mon-Fri 9AM-6PM"
        },
        {
            id: 8,
            title: "Loan Support",
            number: "1800-456-7890",
            icon: "🏠",
            description: "Loan Related Queries",
            available: "Mon-Fri 9AM-6PM"
        }
    ];

    const fraudHelplines = [
        {
            id: 9,
            title: "Cyber Crime",
            number: "155260",
            icon: "🛡️",
            description: "Report Cyber Fraud",
            available: "24/7"
        },
        {
            id: 10,
            title: "Banking Fraud",
            number: "1930",
            icon: "⚠️",
            description: "Report Banking Fraud",
            available: "24/7"
        }
    ];

    const makeCall = (number, title) => {
        Alert.alert(
            `Call ${title}`,
            `Do you want to call ${number}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Call",
                    onPress: () => {
                        Linking.openURL(`tel:${number}`);
                    }
                }
            ]
        );
    };

    const renderHelplineCard = (helpline, isEmergency = false) => (
        <Pressable 
            key={helpline.id} 
            style={[
                styles.helplineCard,
                isEmergency && styles.emergencyCard
            ]}
            onPress={() => makeCall(helpline.number, helpline.title)}
        >
            <View style={styles.cardHeader}>
                <View style={styles.helplineInfo}>
                    <Text style={styles.helplineIcon}>{helpline.icon}</Text>
                    <View style={styles.helplineDetails}>
                        <Text style={[
                            styles.helplineTitle,
                            isEmergency && styles.emergencyTitle
                        ]}>
                            {helpline.title}
                        </Text>
                        <Text style={styles.helplineNumber}>{helpline.number}</Text>
                    </View>
                </View>
                <Pressable 
                    style={[
                        styles.callButton,
                        isEmergency && styles.emergencyCallButton
                    ]}
                    onPress={() => makeCall(helpline.number, helpline.title)}
                >
                    <Text style={styles.callIcon}>📞</Text>
                </Pressable>
            </View>
            <Text style={styles.helplineDescription}>{helpline.description}</Text>
            <View style={styles.availabilityContainer}>
                <Text style={styles.availabilityText}>⏰ {helpline.available}</Text>
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Helpline Dialer</Text>
                <Pressable style={styles.notificationButton}>
                    <Text style={styles.notificationIcon}>🔔</Text>
                </Pressable>
            </View>

            {/* Main Content */}
            <View style={styles.content}>


                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Emergency Numbers */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Emergency Numbers</Text>
                        <View style={styles.emergencyGrid}>
                            {emergencyNumbers.map((helpline) => (
                                <Pressable 
                                    key={helpline.id}
                                    style={styles.emergencyGridCard}
                                    onPress={() => makeCall(helpline.number, helpline.title)}
                                >
                                    <Text style={styles.gridIcon}>{helpline.icon}</Text>
                                    <Text style={styles.gridTitle}>{helpline.title}</Text>
                                    <Text style={styles.gridNumber}>{helpline.number}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Bank Helplines */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Bank Helplines</Text>
                        {bankHelplines.map((helpline) => renderHelplineCard(helpline))}
                    </View>

                    {/* Fraud Helplines */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Fraud Helplines</Text>
                        {fraudHelplines.map((helpline) => renderHelplineCard(helpline, true))}
                    </View>
                </ScrollView>
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
        paddingTop: 10,
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
        marginTop: 10,
        paddingTop: 30,
    },

    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#ffffff",
        marginBottom: 15,
    },
    emergencyGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    emergencyGridCard: {
        width: "47%",
        backgroundColor: "#ffebee",
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center",
        marginBottom: 15,
        borderWidth: 2,
        borderColor: "#d01f00",
    },
    gridIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    gridTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#d01f00",
        textAlign: "center",
        marginBottom: 4,
    },
    gridNumber: {
        fontSize: 16,
        fontWeight: "700",
        color: "#000000",
        textAlign: "center",
    },
    helplineCard: {
        backgroundColor: "#e8f5e9",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    emergencyCard: {
        backgroundColor: "#ffebee",
        borderWidth: 1,
        borderColor: "#d01f00",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    helplineInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    helplineIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    helplineDetails: {
        flex: 1,
    },
    helplineTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 2,
    },
    emergencyTitle: {
        color: "#d01f00",
    },
    helplineNumber: {
        fontSize: 14,
        fontWeight: "500",
        color: "#2e7d32",
    },
    callButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#2e7d32",
        justifyContent: "center",
        alignItems: "center",
    },
    emergencyCallButton: {
        backgroundColor: "#d01f00",
    },
    callIcon: {
        fontSize: 16,
    },
    helplineDescription: {
        fontSize: 14,
        color: "#666666",
        marginBottom: 8,
        lineHeight: 18,
    },
    availabilityContainer: {
        alignSelf: "flex-start",
    },
    availabilityText: {
        fontSize: 12,
        color: "#666666",
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
});

export default HelplineDialer;