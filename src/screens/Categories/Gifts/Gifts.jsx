import * as React from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const Gifts = () => {
    const navigation = useNavigation();
    const [userPoints] = React.useState(2450); // User's current points

    const rewardCategories = [
        {
            id: 1,
            title: "Shopping Vouchers",
            icon: "🛒",
            todayRewards: 5,
            totalRewards: 128,
            bgColor: "#e8f5e9",
            iconBg: "#4caf50"
        },
        {
            id: 2,
            title: "Travel & Experience",
            icon: "✈️",
            todayRewards: 2,
            totalRewards: 45,
            bgColor: "#e3f2fd",
            iconBg: "#2196f3"
        },
        {
            id: 3,
            title: "Electronics",
            icon: "📱",
            todayRewards: 1,
            totalRewards: 23,
            bgColor: "#fff3e0",
            iconBg: "#ff9800"
        },
        {
            id: 4,
            title: "Dining & Food",
            icon: "🍽️",
            todayRewards: 8,
            totalRewards: 167,
            bgColor: "#fce4ec",
            iconBg: "#e91e63"
        },
        {
            id: 5,
            title: "Entertainment",
            icon: "🎬",
            todayRewards: 3,
            totalRewards: 89,
            bgColor: "#f3e5f5",
            iconBg: "#9c27b0"
        },
        {
            id: 6,
            title: "Health & Wellness",
            icon: "💪",
            todayRewards: 0,
            totalRewards: 34,
            bgColor: "#e0f2f1",
            iconBg: "#009688"
        }
    ];

    const featuredRewards = [
        {
            id: 1,
            title: "Amazon Gift Card",
            points: 500,
            originalPrice: "₹500",
            image: "🎁",
            category: "Shopping",
            popular: true
        },
        {
            id: 2,
            title: "Starbucks Coffee",
            points: 300,
            originalPrice: "₹350",
            image: "☕",
            category: "Dining",
            popular: false
        },
        {
            id: 3,
            title: "Movie Tickets",
            points: 400,
            originalPrice: "₹450",
            image: "🎟️",
            category: "Entertainment",
            popular: true
        }
    ];

    const renderRewardCard = (reward) => (
        <View key={reward.id} style={[styles.rewardCard, { backgroundColor: reward.bgColor }]}>
            <View style={styles.rewardHeader}>
                <View style={[styles.rewardIconContainer, { backgroundColor: reward.iconBg }]}>
                    <Text style={styles.rewardIcon}>{reward.icon}</Text>
                </View>
                <View style={styles.rewardInfo}>
                    <Text style={styles.rewardTitle}>{reward.title}</Text>
                    <View style={styles.rewardStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statIcon}>🎁</Text>
                            <View>
                                <Text style={styles.statLabel}>Today's</Text>
                                <Text style={styles.statValue}>{reward.todayRewards.toString().padStart(2, '0')}</Text>
                            </View>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statIcon}>🏆</Text>
                            <View>
                                <Text style={styles.statLabel}>Total</Text>
                                <Text style={styles.statValue}>{reward.totalRewards.toString().padStart(2, '0')}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Gifts</Text>
                <Pressable style={styles.notificationButton}>
                    <Text style={styles.notificationIcon}>🔔</Text>
                </Pressable>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Points Balance */}
                <View style={styles.pointsSection}>
                    <View style={styles.pointsCard}>
                        <Text style={styles.pointsIcon}>💎</Text>
                        <View style={styles.pointsInfo}>
                            <Text style={styles.pointsLabel}>Your Points</Text>
                            <Text style={styles.pointsValue}>{userPoints.toLocaleString()}</Text>
                        </View>
                        <Pressable style={styles.historyButton}>
                            <Text style={styles.historyText}>History</Text>
                        </Pressable>
                    </View>
                </View>

                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Featured Rewards */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Featured Rewards</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
                            {featuredRewards.map((item) => (
                                <Pressable key={item.id} style={styles.featuredCard}>
                                    {item.popular && (
                                        <View style={styles.popularBadge}>
                                            <Text style={styles.popularText}>Popular</Text>
                                        </View>
                                    )}
                                    <Text style={styles.featuredIcon}>{item.image}</Text>
                                    <Text style={styles.featuredTitle}>{item.title}</Text>
                                    <Text style={styles.featuredCategory}>{item.category}</Text>
                                    <View style={styles.featuredPricing}>
                                        <Text style={styles.pointsRequired}>{item.points} pts</Text>
                                        <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                                    </View>
                                    <Pressable style={[
                                        styles.redeemButton,
                                        userPoints < item.points && styles.redeemButtonDisabled
                                    ]}>
                                        <Text style={[
                                            styles.redeemText,
                                            userPoints < item.points && styles.redeemTextDisabled
                                        ]}>
                                            {userPoints >= item.points ? 'Redeem' : 'Not Enough Points'}
                                        </Text>
                                    </Pressable>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Reward Categories */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Reward Categories</Text>
                        {rewardCategories.map((reward) => renderRewardCard(reward))}
                    </View>

                    {/* More Button */}
                    <Pressable style={styles.moreButton}>
                        <Text style={styles.moreButtonText}>Explore All Rewards</Text>
                    </Pressable>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#00C896",
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
        backgroundColor: "#f5f5f5",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: 20,
        paddingTop: 30,
    },
    pointsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    pointsCard: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pointsIcon: {
        fontSize: 32,
        marginRight: 15,
    },
    pointsInfo: {
        flex: 1,
    },
    pointsLabel: {
        fontSize: 14,
        color: "#666666",
        marginBottom: 4,
    },
    pointsValue: {
        fontSize: 24,
        fontWeight: "700",
        color: "#00C896",
    },
    historyButton: {
        backgroundColor: "#00C896",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    historyText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "500",
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
        color: "#333333",
        marginBottom: 15,
    },
    featuredScroll: {
        marginBottom: 10,
    },
    featuredCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginRight: 15,
        width: 160,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    popularBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#ff4444",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    popularText: {
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "600",
    },
    featuredIcon: {
        fontSize: 32,
        textAlign: "center",
        marginBottom: 8,
    },
    featuredTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333333",
        textAlign: "center",
        marginBottom: 4,
    },
    featuredCategory: {
        fontSize: 12,
        color: "#666666",
        textAlign: "center",
        marginBottom: 12,
    },
    featuredPricing: {
        alignItems: "center",
        marginBottom: 12,
    },
    pointsRequired: {
        fontSize: 16,
        fontWeight: "700",
        color: "#00C896",
    },
    originalPrice: {
        fontSize: 12,
        color: "#999999",
        textDecorationLine: "line-through",
    },
    redeemButton: {
        backgroundColor: "#00C896",
        paddingVertical: 8,
        borderRadius: 12,
    },
    redeemButtonDisabled: {
        backgroundColor: "#cccccc",
    },
    redeemText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
    },
    redeemTextDisabled: {
        color: "#666666",
    },
    rewardCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
    },
    rewardHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    rewardIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    rewardIcon: {
        fontSize: 24,
    },
    rewardInfo: {
        flex: 1,
    },
    rewardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 12,
    },
    rewardStats: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    statIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    statLabel: {
        fontSize: 12,
        color: "#666666",
        textAlign: "center",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#ff4444",
        textAlign: "center",
    },
    moreButton: {
        backgroundColor: "#00C896",
        borderRadius: 25,
        paddingVertical: 15,
        marginBottom: 30,
        marginHorizontal: 20,
    },
    moreButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});

export default Gifts;