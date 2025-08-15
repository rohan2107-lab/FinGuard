import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const ModernGoalTracker = ({ navigation }) => {
  // State Management
  const [formData, setFormData] = useState({
    Income: 5000,
    Age: 30,
    Dependents: 2,
    City_Tier: 1,
    Occupation: "Engineer",
    Rent: 1200,
    Loan_Repayment: 500,
    Insurance: 200,
    Groceries: 400,
    Transport: 150,
    Eating_Out: 100,
    Entertainment: 80,
    Utilities: 180,
    Healthcare: 120,
    Education: 250,
    Miscellaneous: 70,
    Desired_Savings: 1000,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("income");
  const [showTips, setShowTips] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState([]);

  // Animation Values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [headerAnim] = useState(new Animated.Value(-100));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [pulseAnim] = useState(new Animated.Value(1));

  // Form Categories for Better Organization
  const formCategories = {
    income: {
      title: "Income & Demographics",
      icon: "wallet",
      color: ["#4CAF50", "#66BB6A"],
      fields: ["Income", "Age", "Dependents", "City_Tier", "Occupation"]
    },
    fixed: {
      title: "Fixed Expenses",
      icon: "home",
      color: ["#FF6B35", "#FF8A65"],
      fields: ["Rent", "Loan_Repayment", "Insurance", "Utilities"]
    },
    variable: {
      title: "Variable Expenses",
      icon: "card",
      color: ["#9C27B0", "#BA68C8"],
      fields: ["Groceries", "Transport", "Eating_Out", "Entertainment", "Healthcare", "Education", "Miscellaneous"]
    },
    goals: {
      title: "Savings Goals",
      icon: "trending-up",
      color: ["#2196F3", "#42A5F5"],
      fields: ["Desired_Savings"]
    }
  };

  // Field Labels and Info
  const fieldInfo = {
    Income: { label: "Monthly Income", icon: "cash", suffix: "$", tip: "Your total monthly income after taxes" },
    Age: { label: "Age", icon: "person", suffix: "yrs", tip: "Your current age" },
    Dependents: { label: "Dependents", icon: "people", suffix: "", tip: "Number of people dependent on you" },
    City_Tier: { label: "City Tier", icon: "location", suffix: "", tip: "1=Metro, 2=Tier-1, 3=Tier-2" },
    Occupation: { label: "Occupation", icon: "briefcase", suffix: "", tip: "Your primary occupation" },
    Rent: { label: "Rent/Mortgage", icon: "home", suffix: "$", tip: "Monthly housing costs" },
    Loan_Repayment: { label: "Loan Payments", icon: "card", suffix: "$", tip: "Monthly loan repayments" },
    Insurance: { label: "Insurance", icon: "shield", suffix: "$", tip: "Monthly insurance premiums" },
    Groceries: { label: "Groceries", icon: "basket", suffix: "$", tip: "Monthly grocery expenses" },
    Transport: { label: "Transportation", icon: "car", suffix: "$", tip: "Monthly transport costs" },
    Eating_Out: { label: "Dining Out", icon: "restaurant", suffix: "$", tip: "Monthly dining expenses" },
    Entertainment: { label: "Entertainment", icon: "game-controller", suffix: "$", tip: "Movies, games, hobbies" },
    Utilities: { label: "Utilities", icon: "flash", suffix: "$", tip: "Electricity, water, internet" },
    Healthcare: { label: "Healthcare", icon: "medical", suffix: "$", tip: "Monthly medical expenses" },
    Education: { label: "Education", icon: "school", suffix: "$", tip: "Learning and development costs" },
    Miscellaneous: { label: "Miscellaneous", icon: "ellipsis-horizontal", suffix: "$", tip: "Other monthly expenses" },
    Desired_Savings: { label: "Savings Target", icon: "star", suffix: "$", tip: "Monthly savings goal" },
  };

  // Component Mount Animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay: 600,
        useNativeDriver: true,
      })
    ]).start();

    // Pulse animation for loading
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    if (loading) {
      pulseLoop.start();
    } else {
      pulseLoop.stop();
    }

    return () => pulseLoop.stop();
  }, [loading]);

  // Handle form changes
  const handleChange = (key, value) => {
    if (key === "Occupation") {
      setFormData({ ...formData, [key]: value });
    } else {
      const numericValue = parseFloat(value) || 0;
      setFormData({ ...formData, [key]: numericValue });
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const fixedExpenses = formCategories.fixed.fields.reduce((sum, field) => sum + formData[field], 0);
    const variableExpenses = formCategories.variable.fields.reduce((sum, field) => sum + formData[field], 0);
    const totalExpenses = fixedExpenses + variableExpenses;
    const currentSavings = formData.Income - totalExpenses;
    return { fixedExpenses, variableExpenses, totalExpenses, currentSavings };
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { totalExpenses } = calculateTotals();
    
    if (totalExpenses >= formData.Income) {
      Alert.alert(
        "Budget Alert",
        "Your total expenses exceed your income. Please review your budget.",
        [{ text: "OK" }]
      );
      return;
    }

    setLoading(true);
    
    try {
      // Ensure all numeric fields are properly formatted
      const requestData = {
        Income: parseFloat(formData.Income) || 0,
        Age: parseInt(formData.Age) || 0,
        Dependents: parseInt(formData.Dependents) || 0,
        City_Tier: parseInt(formData.City_Tier) || 1,
        Occupation: String(formData.Occupation) || "Unknown",
        Rent: parseFloat(formData.Rent) || 0,
        Loan_Repayment: parseFloat(formData.Loan_Repayment) || 0,
        Insurance: parseFloat(formData.Insurance) || 0,
        Groceries: parseFloat(formData.Groceries) || 0,
        Transport: parseFloat(formData.Transport) || 0,
        Eating_Out: parseFloat(formData.Eating_Out) || 0,
        Entertainment: parseFloat(formData.Entertainment) || 0,
        Utilities: parseFloat(formData.Utilities) || 0,
        Healthcare: parseFloat(formData.Healthcare) || 0,
        Education: parseFloat(formData.Education) || 0,
        Miscellaneous: parseFloat(formData.Miscellaneous) || 0,
        Desired_Savings: parseFloat(formData.Desired_Savings) || 0
      };

      console.log("Sending request data:", requestData);

      const res = await fetch("http://10.246.66.93:7000/predict_and_recommend", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestData),
      });

      const responseText = await res.text();
      console.log("Raw response:", responseText);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log("Parsed response data:", data);
      
      setResult(data);

      // Animate result appearance
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();

    } catch (error) {
      console.error("Detailed error:", error);
      Alert.alert(
        "Error", 
        `Failed to get predictions: ${error.message}. Please check your connection and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Save profile
  const saveProfile = () => {
    Alert.prompt(
      "Save Profile",
      "Enter a name for this profile:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: (name) => {
            if (name) {
              const newProfile = {
                id: Date.now(),
                name,
                data: { ...formData },
                createdAt: new Date().toLocaleDateString()
              };
              setSavedProfiles([...savedProfiles, newProfile]);
              Alert.alert("Success", "Profile saved successfully!");
            }
          }
        }
      ],
      "plain-text"
    );
  };

  // Load profile
  const loadProfile = (profile) => {
    setFormData(profile.data);
    Alert.alert("Success", `Profile "${profile.name}" loaded successfully!`);
  };

  // Render category tabs
  const renderCategoryTabs = () => (
    <View style={styles.categoryTabs}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Object.entries(formCategories).map(([key, category]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.categoryTab,
              activeCategory === key && styles.activeCategoryTab
            ]}
            onPress={() => setActiveCategory(key)}
          >
            <LinearGradient
              colors={activeCategory === key ? category.color : ['#F5F5F5', '#F5F5F5']}
              style={styles.categoryTabGradient}
            >
              <Ionicons
                name={category.icon}
                size={20}
                color={activeCategory === key ? "#FFFFFF" : "#757575"}
              />
              <Text style={[
                styles.categoryTabText,
                { color: activeCategory === key ? "#FFFFFF" : "#757575" }
              ]}>
                {category.title}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Render form fields for active category
  const renderFormFields = () => {
    const category = formCategories[activeCategory];
    return (
      <View style={styles.formSection}>
        {category.fields.map((field) => (
          <Animated.View
            key={field}
            style={[
              styles.inputContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.inputHeader}>
              <View style={styles.inputLabelContainer}>
                <Ionicons name={fieldInfo[field].icon} size={18} color="#666" />
                <Text style={styles.inputLabel}>{fieldInfo[field].label}</Text>
              </View>
              <TouchableOpacity
                onPress={() => Alert.alert("Info", fieldInfo[field].tip)}
              >
                <Ionicons name="information-circle-outline" size={18} color="#999" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputWrapper}>
              {fieldInfo[field].suffix === "$" && (
                <Text style={styles.inputPrefix}>$</Text>
              )}
              <TextInput
                style={[
                  styles.input,
                  fieldInfo[field].suffix === "$" && styles.inputWithPrefix
                ]}
                keyboardType={field === "Occupation" ? "default" : "numeric"}
                value={String(formData[field])}
                onChangeText={(value) => handleChange(field, value)}
                placeholder="0"
                placeholderTextColor="#999"
              />
              {fieldInfo[field].suffix && fieldInfo[field].suffix !== "$" && (
                <Text style={styles.inputSuffix}>{fieldInfo[field].suffix}</Text>
              )}
            </View>
          </Animated.View>
        ))}
      </View>
    );
  };

  // Render budget summary
  const renderBudgetSummary = () => {
    const { fixedExpenses, variableExpenses, totalExpenses, currentSavings } = calculateTotals();
    const savingsRate = ((currentSavings / formData.Income) * 100).toFixed(1);
    
    return (
      <Animated.View
        style={[
          styles.summaryCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.summaryGradient}
        >
          <Text style={styles.summaryTitle}>Budget Overview</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="trending-up" size={24} color="#4CAF50" />
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={styles.summaryValue}>${formData.Income}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Ionicons name="trending-down" size={24} color="#FF5722" />
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={styles.summaryValue}>${totalExpenses}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.summaryLabel}>Savings</Text>
              <Text style={[
                styles.summaryValue,
                { color: currentSavings >= 0 ? "#4CAF50" : "#FF5722" }
              ]}>
                ${currentSavings}
              </Text>
            </View>
          </View>
          
          <View style={styles.savingsRateContainer}>
            <Text style={styles.savingsRateLabel}>Savings Rate</Text>
            <Text style={[
              styles.savingsRateValue,
              { color: parseFloat(savingsRate) >= 20 ? "#4CAF50" : "#FF9800" }
            ]}>
              {savingsRate}%
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  // Render results
  const renderResults = () => {
    if (!result) return null;

    const achievementPercentage = ((result.achieved_savings / formData.Desired_Savings) * 100).toFixed(1);
    
    return (
      <Animated.View
        style={[
          styles.resultsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={result.feasible ? ['#E8F5E9', '#C8E6C9'] : ['#FFEBEE', '#FFCDD2']}
          style={styles.resultsCard}
        >
          <View style={styles.resultsHeader}>
            <Ionicons
              name={result.feasible ? "checkmark-circle" : "warning"}
              size={32}
              color={result.feasible ? "#4CAF50" : "#F44336"}
            />
            <Text style={[
              styles.resultsTitle,
              { color: result.feasible ? "#4CAF50" : "#F44336" }
            ]}>
              {result.feasible ? "Goal Achievable!" : "Goal Challenging"}
            </Text>
          </View>

          <View style={styles.resultsGrid}>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Predicted Savings</Text>
              <Text style={styles.resultValue}>${result.predicted_savings}</Text>
            </View>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Achieved Savings</Text>
              <Text style={styles.resultValue}>${result.achieved_savings}</Text>
            </View>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Achievement Rate</Text>
              <Text style={[
                styles.resultValue,
                { color: parseFloat(achievementPercentage) >= 100 ? "#4CAF50" : "#FF9800" }
              ]}>
                {achievementPercentage}%
              </Text>
            </View>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Time to Goal</Text>
              <Text style={styles.resultValue}>
                {result.months_to_goal ? `${result.months_to_goal} months` : "N/A"}
              </Text>
            </View>
          </View>

          {result.recommended_reduction_pct_on_variable > 0 && (
            <View style={styles.recommendationContainer}>
              <Ionicons name="bulb" size={20} color="#FF9800" />
              <Text style={styles.recommendationText}>
                Consider reducing variable expenses by {(result.recommended_reduction_pct_on_variable * 100).toFixed(1)}% 
                to reach your savings goal faster.
              </Text>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#667eea" barStyle="light-content" />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          { transform: [{ translateY: headerAnim }] }
        ]}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.headerGradient}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Ionicons name="analytics" size={32} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Goal Tracker</Text>
            <Text style={styles.headerSubtitle}>Smart Financial Planning</Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Ionicons name="bookmark" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Budget Summary */}
          {renderBudgetSummary()}

          {/* Category Navigation */}
          {renderCategoryTabs()}

          {/* Form Fields */}
          {renderFormFields()}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[
                styles.analyzeButton,
                { opacity: loading ? 0.7 : 1 }
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ['#9E9E9E', '#BDBDBD'] : ['#667eea', '#764ba2']}
                style={styles.analyzeButtonGradient}
              >
                {loading ? (
                  <Animated.View 
                    style={[
                      styles.loadingContent,
                      { transform: [{ scale: pulseAnim }] }
                    ]}
                  >
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.analyzeButtonText}>Analyzing...</Text>
                  </Animated.View>
                ) : (
                  <View style={styles.analyzeContent}>
                    <Ionicons name="calculator" size={22} color="#FFFFFF" />
                    <Text style={styles.analyzeButtonText}>Analyze & Predict</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tipsButton}
              onPress={() => setShowTips(true)}
            >
              <Ionicons name="help-circle" size={20} color="#667eea" />
              <Text style={styles.tipsButtonText}>Tips</Text>
            </TouchableOpacity>
          </View>

          {/* Results */}
          {renderResults()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Tips Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTips}
        onRequestClose={() => setShowTips(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Financial Tips</Text>
              <TouchableOpacity onPress={() => setShowTips(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.tipsContainer}>
              <View style={styles.tip}>
                <Ionicons name="bulb" size={20} color="#FFD700" />
                <Text style={styles.tipText}>Aim for a 20% savings rate for long-term financial health</Text>
              </View>
              <View style={styles.tip}>
                <Ionicons name="shield" size={20} color="#4CAF50" />
                <Text style={styles.tipText}>Build an emergency fund covering 3-6 months of expenses</Text>
              </View>
              <View style={styles.tip}>
                <Ionicons name="trending-down" size={20} color="#FF5722" />
                <Text style={styles.tipText}>Track and reduce variable expenses to increase savings</Text>
              </View>
              <View style={styles.tip}>
                <Ionicons name="card" size={20} color="#9C27B0" />
                <Text style={styles.tipText}>Pay off high-interest debt before focusing on investments</Text>
              </View>
              <View style={styles.tip}>
                <Ionicons name="stats-chart" size={20} color="#2196F3" />
                <Text style={styles.tipText}>Review and adjust your budget monthly for better results</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: 120,
    zIndex: 1000,
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 4,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  summaryCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryGradient: {
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#E3F2FD',
    marginTop: 5,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  savingsRateContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  savingsRateLabel: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  savingsRateValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  categoryTabs: {
    marginBottom: 20,
  },
  categoryTab: {
    marginRight: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  activeCategoryTab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categoryTabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputPrefix: {
    fontSize: 16,
    color: '#666',
    paddingLeft: 12,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  inputWithPrefix: {
    paddingLeft: 4,
  },
  inputSuffix: {
    fontSize: 14,
    color: '#666',
    paddingRight: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  analyzeButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 10,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  analyzeButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyzeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tipsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  tipsButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  resultsContainer: {
    marginBottom: 20,
  },
  resultsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  resultItem: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,152,0,0.1)',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#E65100',
    marginLeft: 10,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  tipsContainer: {
    padding: 20,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default ModernGoalTracker;