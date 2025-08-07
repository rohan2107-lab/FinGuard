import * as React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, ParamListBase } from "@react-navigation/native";
import Vector1 from "../../../assets/notification.svg"
import Vector from "../../../assets/bring-back.svg"

const EmergencyHelp = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            {/* Red Header */}
            <View style={styles.redHeader}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Vector style={styles.backIcon} width={24} height={24} />
                </Pressable>
                
                <View style={styles.titleContainer}>
                    <Text style={styles.emergencyText}>Emergency</Text>
                    <Text style={styles.helpText}>Help</Text>
                </View>
                
                <View style={styles.notificationContainer}>
                    <Vector1 style={styles.notificationIcon} width={20} height={20} />
                </View>
            </View>

            {/* Dark Content Area */}
            <View style={styles.darkContent}>
                {/* Top Row Cards */}
                <View style={styles.cardRow}>
                    <Pressable style={styles.card} onPress={() => navigation.navigate("ReportScam")}>
                        <View style={styles.iconContainer}>
                            <Image 
                                style={styles.cardIcon} 
                                resizeMode="contain" 
                                source={require("../../../assets/GoogleForm.png")} 
                            />
                        </View>
                        <Text style={styles.cardTitle}>Report</Text>
                        <Text style={styles.cardSubtitle}>Scam</Text>
                    </Pressable>
                    
                    <Pressable style={styles.card} onPress={() => navigation.navigate("Panic")}>
                        <View style={styles.iconContainer}>
                            <Image 
                                style={styles.cardIcon} 
                                resizeMode="contain" 
                                source={require("../../../assets/Panic.png")} 
                            />
                        </View>
                        <Text style={styles.cardTitle}>Panic</Text>
                        <Text style={styles.cardSubtitle}>Button</Text>
                    </Pressable>
                </View>

                {/* Bottom Row Cards */}
                <View style={styles.cardRow}>
                    <Pressable style={styles.card} onPress={() => navigation.navigate("BranchLocator")}>
                        <View style={styles.iconContainer}>
                            <Image 
                                style={styles.cardIcon} 
                                resizeMode="contain" 
                                source={require("../../../assets/Map.png")} 
                            />
                        </View>
                        <Text style={styles.cardTitle}>NearBy</Text>
                        <Text style={styles.cardSubtitle}>Branch</Text>
                    </Pressable>
                    
                    <Pressable style={styles.card} onPress={() => navigation.navigate("Helpline")}>
                        <View style={styles.iconContainer}>
                            <Image 
                                style={styles.cardIcon} 
                                resizeMode="contain" 
                                source={require("../../../assets/Telephone.png")} 
                            />
                        </View>
                        <Text style={styles.cardTitle}>Helpline</Text>
                        <Text style={styles.cardSubtitle}>Dialer</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#d01f00"
    },
    redHeader: {
        backgroundColor: "#d01f00",
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 30
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: "#ffffff"
    },
    titleContainer: {
        flex: 1,
        alignItems: "center"
    },
    emergencyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#ffffff",
        fontFamily: "Poppins-SemiBold"
    },
    helpText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#093030",
        fontFamily: "Poppins-SemiBold",
        marginTop: -2
    },
    notificationContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    notificationIcon: {
        width: 20,
        height: 20,
        tintColor: "#d01f00"
    },
    darkContent: {
        flex: 1,
        backgroundColor: "#1a2f2f",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 40,
        paddingHorizontal: 30
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30
    },
    card: {
        backgroundColor: "#e8f5e8",
        borderRadius: 20,
        width: "47%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5
    },
    iconContainer: {
        marginBottom: 15
    },
    cardIcon: {
        width: 60,
        height: 60
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a2f2f",
        fontFamily: "Poppins-SemiBold",
        textAlign: "center"
    },
    cardSubtitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a2f2f",
        fontFamily: "Poppins-SemiBold",
        textAlign: "center",
        marginTop: -2
    }
});

export default EmergencyHelp;