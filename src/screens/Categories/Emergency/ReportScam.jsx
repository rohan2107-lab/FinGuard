import * as React from "react";
import {StyleSheet, View, Text, Pressable, Image, TextInput, Modal, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from '@react-navigation/stack';
import {useNavigation, ParamListBase} from "@react-navigation/native";
import Vector from "../../../assets/bring-back.svg"
import Vector1 from "../../../assets/notification.svg"
import Photo from "../../../assets/photo.svg"
import Mic from "../../../assets/mic.svg"
import Outbox from "../../../assets/outbox.svg"

const ReportScam = () => {
    const navigation = useNavigation();
    const [selectedScamType, setSelectedScamType] = React.useState("UPI Fraud");
    const [amount, setAmount] = React.useState("");
    const [dateTime, setDateTime] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [showScamTypeModal, setShowScamTypeModal] = React.useState(false);
    
    const scamTypes = [
        "UPI Fraud",
        "Credit Card Fraud",
        "Online Shopping Scam",
        "Investment Scam",
        "Job Scam",
        "Romance Scam",
        "Tech Support Scam",
        "Other"
    ];
    
    return (
        <SafeAreaView style={styles.container}>
            {/* Red Header */}
            <View style={styles.redHeader}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Vector style={styles.backIcon} width={24} height={24} />
                </Pressable>
                
                <Text style={styles.headerTitle}>Report Scam Form</Text>
                
                <View style={styles.notificationContainer}>
                    <Vector1 style={styles.notificationIcon} width={20} height={20} />
                </View>
            </View>

            {/* Dark Content Area */}
            <View style={styles.darkContent}>
                {/* Types of Scam */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionLabel}>Types Of Scam</Text>
                    <Pressable 
                        style={styles.inputContainer}
                        onPress={() => setShowScamTypeModal(true)}
                    >
                        <View style={styles.iconWrapper}>
                            <View style={styles.scamIcon} />
                        </View>
                        <Text style={styles.inputText}>{selectedScamType}</Text>
                        <View style={styles.dropdownIcon} />
                    </Pressable>
                </View>

                {/* Amount Lost */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionLabel}>Amount Lost</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.iconWrapper}>
                            <Image 
                                style={styles.rupeeIcon} 
                                resizeMode="contain" 
                                source={require("../../../assets/Rupee.png")} 
                            />
                        </View>
                        <TextInput
                            style={styles.textInput}
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="Enter amount lost"
                            placeholderTextColor="#7a7a7a"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Date & Time */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionLabel}>Date & Time</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.iconWrapper}>
                            <Image 
                                style={styles.calendarIcon} 
                                resizeMode="contain" 
                                source={require("../../../assets/Calendar.png")} 
                            />
                        </View>
                        <TextInput
                            style={styles.textInput}
                            value={dateTime}
                            onChangeText={setDateTime}
                            placeholder="Enter date and time"
                            placeholderTextColor="#7a7a7a"
                        />
                    </View>
                </View>

                {/* Description */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionLabel}>Briefly Describe What Happened</Text>
                    <View style={[styles.inputContainer, styles.descriptionContainer]}>
                        <View style={styles.iconWrapper}>
                            <Image 
                                style={styles.pencilIcon} 
                                resizeMode="contain" 
                                source={require("../../../assets/Pencil.png")} 
                            />
                        </View>
                        <TextInput
                            style={[styles.textInput, styles.descriptionInput]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe what happened in detail..."
                            placeholderTextColor="#7a7a7a"
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Upload Section */}
                <View style={styles.uploadSection}>
                    <Pressable style={styles.uploadCard}>
                        <Photo style={styles.uploadIcon} width={30} height={30} />
                        <Text style={styles.uploadText}>Upload Screenshot</Text>
                    </Pressable>
                    
                    <Pressable style={styles.uploadCard}>
                        <Mic style={styles.uploadIcon} width={30} height={30} />
                        <Text style={styles.uploadText}>Upload Audio</Text>
                    </Pressable>
                    
                    <Pressable style={styles.uploadCard}>
                        <Outbox style={styles.uploadIcon} width={30} height={30} />
                        <Text style={styles.uploadText}>Upload Receipt</Text>
                    </Pressable>
                </View>

                {/* Submit Button */}
                <Pressable style={styles.submitButton}>
                    <Text style={styles.submitText}>Submit</Text>
                </Pressable>
            </View>

            {/* Scam Type Selection Modal */}
            <Modal
                visible={showScamTypeModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowScamTypeModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Scam Type</Text>
                        {scamTypes.map((type, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.modalOption,
                                    selectedScamType === type && styles.selectedOption
                                ]}
                                onPress={() => {
                                    setSelectedScamType(type);
                                    setShowScamTypeModal(false);
                                }}
                            >
                                <Text style={[
                                    styles.modalOptionText,
                                    selectedScamType === type && styles.selectedOptionText
                                ]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setShowScamTypeModal(false)}
                        >
                            <Text style={styles.modalCloseText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 20
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
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#093030",
        fontFamily: "Poppins-SemiBold",
        flex: 1,
        textAlign: "center"
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
        paddingTop: 20,
        paddingHorizontal: 25
    },
    formSection: {
        marginBottom: 18
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#ff4444",
        fontFamily: "Poppins-Medium",
        marginBottom: 6,
        textTransform: "capitalize"
    },
    inputContainer: {
        backgroundColor: "#e8f5e8",
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        minHeight: 45
    },
    descriptionContainer: {
        minHeight: 65,
        alignItems: "flex-start",
        paddingVertical: 12
    },
    iconWrapper: {
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10
    },
    scamIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#8B4B99"
    },
    rupeeIcon: {
        width: 20,
        height: 20
    },
    calendarIcon: {
        width: 20,
        height: 20
    },
    pencilIcon: {
        width: 20,
        height: 20
    },
    inputText: {
        flex: 1,
        fontSize: 15,
        fontWeight: "500",
        color: "#1a2f2f",
        fontFamily: "Poppins-Medium"
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: "500",
        color: "#1a2f2f",
        fontFamily: "Poppins-Medium",
        padding: 0
    },
    descriptionInput: {
        minHeight: 50,
        textAlignVertical: "top"
    },
    descriptionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: "500",
        color: "#1a2f2f",
        fontFamily: "Poppins-Medium",
        lineHeight: 20
    },
    dropdownIcon: {
        width: 0,
        height: 0,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderTopWidth: 8,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#1a2f2f"
    },
    uploadSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        marginTop: 5
    },
    uploadCard: {
        backgroundColor: "#e8f5e8",
        borderRadius: 15,
        width: "30%",
        aspectRatio: 0.85,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12
    },
    uploadIcon: {
        marginBottom: 6
    },
    uploadText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#1a2f2f",
        fontFamily: "Poppins-Medium",
        textAlign: "center",
        textTransform: "capitalize"
    },
    submitButton: {
        backgroundColor: "#ff2d55",
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: "center",
        marginBottom: 20
    },
    submitText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
        fontFamily: "Poppins-SemiBold",
        textTransform: "capitalize"
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContent: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 20,
        width: "80%",
        maxHeight: "70%"
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1a2f2f",
        fontFamily: "Poppins-SemiBold",
        textAlign: "center",
        marginBottom: 20
    },
    modalOption: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: "#f5f5f5"
    },
    selectedOption: {
        backgroundColor: "#e8f5e8"
    },
    modalOptionText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1a2f2f",
        fontFamily: "Poppins-Medium"
    },
    selectedOptionText: {
        color: "#d01f00"
    },
    modalCloseButton: {
        backgroundColor: "#ff2d55",
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 10
    },
    modalCloseText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
        fontFamily: "Poppins-SemiBold"
    }
});

export default ReportScam;