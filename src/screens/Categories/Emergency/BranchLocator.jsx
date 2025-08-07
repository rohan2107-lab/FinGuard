import * as React from "react";
import { StyleSheet, Text, View, Pressable, Image, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const BranchLocator = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = React.useState('');

    const nearbyBranches = [
        {
            id: 1,
            name: "Civil Lines Branch",
            address: "MG Marg, Civil Lines, Prayagraj",
            distance: "0.8 km",
            timings: "9:00 AM - 4:00 PM",
            type: "Full Service"
        },
        {
            id: 2,
            name: "Katra Branch",
            address: "Sardar Patel Marg, Katra, Prayagraj",
            distance: "1.2 km",
            timings: "9:00 AM - 4:00 PM",
            type: "Full Service"
        },
        {
            id: 3,
            name: "Georgetown Branch",
            address: "SN Sen Street, Georgetown, Prayagraj",
            distance: "2.1 km",
            timings: "9:00 AM - 4:00 PM",
            type: "ATM Only"
        },
        {
            id: 4,
            name: "Jhunsi Branch",
            address: "Main Road, Jhunsi, Prayagraj",
            distance: "3.5 km",
            timings: "9:00 AM - 4:00 PM",
            type: "Full Service"
        }
    ];

    const quickServices = [
        { id: 1, title: "ATM Locator", icon: "🏧" },
        { id: 2, title: "Nearest Branch", icon: "🏢" },
        { id: 3, title: "24/7 Services", icon: "🕐" },
        { id: 4, title: "Drive Through", icon: "🚗" }
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Branch Locator</Text>
                <Pressable style={styles.notificationButton}>
                    <Text style={styles.notificationIcon}>🔔</Text>
                </Pressable>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Search Section */}
                <View style={styles.searchSection}>
                    <View style={styles.searchContainer}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search location or branch name"
                            placeholderTextColor="#666"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                    <Pressable style={styles.currentLocationButton}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.currentLocationText}>Use Current Location</Text>
                    </Pressable>
                </View>

                {/* Quick Services */}
                <View style={styles.quickServicesSection}>
                    <Text style={styles.sectionTitle}>Quick Services</Text>
                    <View style={styles.servicesGrid}>
                        {quickServices.map((service) => (
                            <Pressable key={service.id} style={styles.serviceCard}>
                                <Text style={styles.serviceIcon}>{service.icon}</Text>
                                <Text style={styles.serviceText}>{service.title}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Nearby Branches */}
                <View style={styles.branchesSection}>
                    <Text style={styles.sectionTitle}>Nearby Branches</Text>
                    <ScrollView style={styles.branchList} showsVerticalScrollIndicator={false}>
                        {nearbyBranches.map((branch) => (
                            <Pressable key={branch.id} style={styles.branchCard}>
                                <View style={styles.branchHeader}>
                                    <View style={styles.branchInfo}>
                                        <Text style={styles.branchName}>{branch.name}</Text>
                                        <Text style={styles.branchDistance}>{branch.distance}</Text>
                                    </View>
                                    <View style={styles.branchTypeContainer}>
                                        <Text style={[
                                            styles.branchType, 
                                            branch.type === 'ATM Only' ? styles.atmOnly : styles.fullService
                                        ]}>
                                            {branch.type}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.branchAddress}>{branch.address}</Text>
                                <View style={styles.branchFooter}>
                                    <Text style={styles.branchTimings}>⏰ {branch.timings}</Text>
                                    <Pressable style={styles.directionsButton}>
                                        <Text style={styles.directionsText}>Get Directions</Text>
                                    </Pressable>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
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
        marginTop: 5,
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    searchSection: {
        marginBottom: 30,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        height: 50,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    currentLocationButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#d01f00",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 15,
        justifyContent: "center",
    },
    locationIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    currentLocationText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "500",
    },
    quickServicesSection: {
        marginBottom:5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#ffffff",
        marginBottom: 5,
    },
    servicesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    serviceCard: {
        width: "47%",
        backgroundColor: "#e8f5e9",
        borderRadius: 16,
        paddingVertical: 5,
        paddingHorizontal: 20,
        alignItems: "center",
        marginBottom: 15,
    },
    serviceIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    serviceText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#000000",
        textAlign: "center",
    },
    branchesSection: {
        flex: 1,
    },
    branchList: {
        flex: 1,
    },
    branchCard: {
        backgroundColor: "#e8f5e9",
        borderRadius: 16,
        padding: 16,
        marginBottom: 15,
    },
    branchHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    branchInfo: {
        flex: 1,
    },
    branchName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 4,
    },
    branchDistance: {
        fontSize: 14,
        color: "#d01f00",
        fontWeight: "500",
    },
    branchTypeContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    branchType: {
        fontSize: 12,
        fontWeight: "500",
    },
    fullService: {
        color: "#2e7d32",
        backgroundColor: "#c8e6c9",
    },
    atmOnly: {
        color: "#f57c00",
        backgroundColor: "#ffe0b2",
    },
    branchAddress: {
        fontSize: 14,
        color: "#666666",
        marginBottom: 12,
        lineHeight: 20,
    },
    branchFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    branchTimings: {
        fontSize: 12,
        color: "#666666",
    },
    directionsButton: {
        backgroundColor: "#d01f00",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    directionsText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "500",
    },
});

export default BranchLocator;