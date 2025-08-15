import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';

const FinanceCalculator = () => {
    const navigation = useNavigation();
  const [activeCalculator, setActiveCalculator] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // SIP Calculator State
  const [sipData, setSipData] = useState({
    monthlyAmount: '',
    years: '',
    expectedReturn: '',
    result: null
  });

  // Loan Calculator State
  const [loanData, setLoanData] = useState({
    loanAmount: '',
    interestRate: '',
    tenure: '',
    result: null
  });

  // FD Calculator State
  const [fdData, setFdData] = useState({
    principal: '',
    rate: '',
    years: '',
    result: null
  });

  // PPF Calculator State
  const [ppfData, setPpfData] = useState({
    monthlyAmount: '',
    years: '',
    result: null
  });

  // Tax Calculator State
  const [taxData, setTaxData] = useState({
    income: '',
    regime: 'old', // 'old' or 'new'
    hra: '',
    section80C: '',
    section80D: '',
    result: null
  });

  // Retirement Planner State
  const [retirementData, setRetirementData] = useState({
    currentAge: '',
    retirementAge: '',
    monthlyExpenses: '',
    inflation: '',
    expectedReturn: '',
    currentSavings: '',
    result: null
  });

  const calculatorTools = [
    {
      id: 1,
      title: "SIP Calculator",
      icon: "💰",
      description: "Calculate mutual fund SIP returns",
      bgColor: "#ecfdf5",
      iconColor: "#10b981"
    },
    {
      id: 2,
      title: "Loan Calculator",
      icon: "🏠",
      description: "Calculate EMI for home/personal loans",
      bgColor: "#eff6ff",
      iconColor: "#3b82f6"
    },
    {
      id: 3,
      title: "FD Calculator",
      icon: "🏦",
      description: "Calculate fixed deposit returns",
      bgColor: "#fef3c7",
      iconColor: "#f59e0b"
    },
    {
      id: 4,
      title: "PPF Calculator",
      icon: "📊",
      description: "Calculate PPF maturity amount",
      bgColor: "#f3e8ff",
      iconColor: "#8b5cf6"
    },
    {
      id: 5,
      title: "Tax Calculator",
      icon: "💸",
      description: "Calculate income tax liability",
      bgColor: "#fecaca",
      iconColor: "#ef4444"
    },
    {
      id: 6,
      title: "Retirement Planner",
      icon: "🎯",
      description: "Plan your retirement corpus",
      bgColor: "#d1fae5",
      iconColor: "#059669"
    }
  ];

  // Tax Calculation Logic
  const calculateTax = () => {
    const income = parseFloat(taxData.income);
    const hra = parseFloat(taxData.hra) || 0;
    const section80C = parseFloat(taxData.section80C) || 0;
    const section80D = parseFloat(taxData.section80D) || 0;
    
    if (!income) return;

    let taxableIncome = income;
    let tax = 0;
    
    if (taxData.regime === 'old') {
      // Old Tax Regime
      taxableIncome = income - Math.min(hra, income * 0.5, 100000) - Math.min(section80C, 150000) - Math.min(section80D, 25000);
      
      if (taxableIncome > 250000) {
        if (taxableIncome <= 500000) {
          tax = (taxableIncome - 250000) * 0.05;
        } else if (taxableIncome <= 1000000) {
          tax = 250000 * 0.05 + (taxableIncome - 500000) * 0.20;
        } else {
          tax = 250000 * 0.05 + 500000 * 0.20 + (taxableIncome - 1000000) * 0.30;
        }
      }
      
      // Add 4% cess
      tax = tax * 1.04;
    } else {
      // New Tax Regime (2023-24)
      if (taxableIncome > 300000) {
        if (taxableIncome <= 600000) {
          tax = (taxableIncome - 300000) * 0.05;
        } else if (taxableIncome <= 900000) {
          tax = 300000 * 0.05 + (taxableIncome - 600000) * 0.10;
        } else if (taxableIncome <= 1200000) {
          tax = 300000 * 0.05 + 300000 * 0.10 + (taxableIncome - 900000) * 0.15;
        } else if (taxableIncome <= 1500000) {
          tax = 300000 * 0.05 + 300000 * 0.10 + 300000 * 0.15 + (taxableIncome - 1200000) * 0.20;
        } else {
          tax = 300000 * 0.05 + 300000 * 0.10 + 300000 * 0.15 + 300000 * 0.20 + (taxableIncome - 1500000) * 0.30;
        }
      }
      
      // Add 4% cess
      tax = tax * 1.04;
    }
    
    const netIncome = income - tax;
    const effectiveRate = (tax / income) * 100;
    
    setTaxData({
      ...taxData,
      result: {
        taxableIncome: Math.round(taxableIncome),
        tax: Math.round(tax),
        netIncome: Math.round(netIncome),
        effectiveRate: effectiveRate.toFixed(2)
      }
    });
  };

  // Retirement Planning Logic
  const calculateRetirement = () => {
    const currentAge = parseFloat(retirementData.currentAge);
    const retirementAge = parseFloat(retirementData.retirementAge);
    const monthlyExpenses = parseFloat(retirementData.monthlyExpenses);
    const inflation = parseFloat(retirementData.inflation) / 100;
    const expectedReturn = parseFloat(retirementData.expectedReturn) / 100;
    const currentSavings = parseFloat(retirementData.currentSavings) || 0;
    
    if (!currentAge || !retirementAge || !monthlyExpenses || !inflation || !expectedReturn) return;
    
    const yearsToRetirement = retirementAge - currentAge;
    const retirementYears = 25; // Assuming 25 years after retirement
    
    // Calculate future monthly expenses at retirement
    const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflation, yearsToRetirement);
    
    // Calculate corpus needed at retirement
    const realReturnRate = (expectedReturn - inflation) / (1 + inflation);
    const corpusNeeded = (futureMonthlyExpenses * 12) * ((1 - Math.pow(1 + realReturnRate, -retirementYears)) / realReturnRate);
    
    // Calculate future value of current savings
    const futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement);
    
    // Calculate additional corpus needed
    const additionalCorpusNeeded = Math.max(0, corpusNeeded - futureValueCurrentSavings);
    
    // Calculate monthly SIP required
    const monthlyReturn = expectedReturn / 12;
    const totalMonths = yearsToRetirement * 12;
    const monthlySIPRequired = additionalCorpusNeeded * monthlyReturn / (Math.pow(1 + monthlyReturn, totalMonths) - 1);
    
    setRetirementData({
      ...retirementData,
      result: {
        corpusNeeded: Math.round(corpusNeeded),
        futureMonthlyExpenses: Math.round(futureMonthlyExpenses),
        monthlySIPRequired: Math.round(monthlySIPRequired),
        yearsToRetirement: yearsToRetirement,
        currentSavingsFutureValue: Math.round(futureValueCurrentSavings)
      }
    });
  };

  // SIP Calculator Logic
  const calculateSIP = () => {
    const P = parseFloat(sipData.monthlyAmount);
    const r = parseFloat(sipData.expectedReturn) / 100 / 12;
    const n = parseFloat(sipData.years) * 12;
    
    if (P && r && n) {
      const futureValue = P * (((1 + r) ** n - 1) / r) * (1 + r);
      const totalInvestment = P * n;
      const totalGains = futureValue - totalInvestment;
      
      setSipData({
        ...sipData,
        result: {
          futureValue: Math.round(futureValue),
          totalInvestment: Math.round(totalInvestment),
          totalGains: Math.round(totalGains)
        }
      });
    }
  };

  // Loan Calculator Logic
  const calculateLoan = () => {
    const P = parseFloat(loanData.loanAmount);
    const r = parseFloat(loanData.interestRate) / 100 / 12;
    const n = parseFloat(loanData.tenure) * 12;
    
    if (P && r && n) {
      const emi = P * r * (1 + r) ** n / ((1 + r) ** n - 1);
      const totalAmount = emi * n;
      const totalInterest = totalAmount - P;
      
      setLoanData({
        ...loanData,
        result: {
          emi: Math.round(emi),
          totalAmount: Math.round(totalAmount),
          totalInterest: Math.round(totalInterest)
        }
      });
    }
  };

  // FD Calculator Logic
  const calculateFD = () => {
    const P = parseFloat(fdData.principal);
    const r = parseFloat(fdData.rate) / 100;
    const t = parseFloat(fdData.years);
    
    if (P && r && t) {
      const maturityAmount = P * (1 + r) ** t;
      const interest = maturityAmount - P;
      
      setFdData({
        ...fdData,
        result: {
          maturityAmount: Math.round(maturityAmount),
          interest: Math.round(interest),
          principal: P
        }
      });
    }
  };

  // PPF Calculator Logic
  const calculatePPF = () => {
    const monthlyAmount = parseFloat(ppfData.monthlyAmount);
    const years = parseFloat(ppfData.years);
    const rate = 7.1; // Current PPF rate
    
    if (monthlyAmount && years) {
      const annualAmount = monthlyAmount * 12;
      const r = rate / 100;
      const maturityAmount = annualAmount * (((1 + r) ** years - 1) / r);
      const totalInvestment = annualAmount * years;
      const interest = maturityAmount - totalInvestment;
      
      setPpfData({
        ...ppfData,
        result: {
          maturityAmount: Math.round(maturityAmount),
          totalInvestment: Math.round(totalInvestment),
          interest: Math.round(interest)
        }
      });
    }
  };

  const openCalculator = (calculatorId) => {
    setActiveCalculator(calculatorId);
    setModalVisible(true);
  };

  const closeCalculator = () => {
    setModalVisible(false);
    setActiveCalculator(null);
  };

  const renderTaxCalculator = () => (
    <View style={styles.calculatorContainer}>
      <Text style={styles.calculatorTitle}>Tax Calculator</Text>
      
      <View style={styles.regimeSelector}>
        <Text style={styles.inputLabel}>Tax Regime</Text>
        <View style={styles.regimeButtons}>
          <Pressable 
            style={[styles.regimeButton, taxData.regime === 'old' && styles.regimeButtonActive]}
            onPress={() => setTaxData({...taxData, regime: 'old'})}
          >
            <Text style={[styles.regimeButtonText, taxData.regime === 'old' && styles.regimeButtonTextActive]}>Old Regime</Text>
          </Pressable>
          <Pressable 
            style={[styles.regimeButton, taxData.regime === 'new' && styles.regimeButtonActive]}
            onPress={() => setTaxData({...taxData, regime: 'new'})}
          >
            <Text style={[styles.regimeButtonText, taxData.regime === 'new' && styles.regimeButtonTextActive]}>New Regime</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Annual Income (₹)</Text>
        <TextInput
          style={styles.input}
          value={taxData.income}
          onChangeText={(text) => setTaxData({...taxData, income: text})}
          placeholder="1000000"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      {taxData.regime === 'old' && (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>HRA (₹)</Text>
            <TextInput
              style={styles.input}
              value={taxData.hra}
              onChangeText={(text) => setTaxData({...taxData, hra: text})}
              placeholder="100000"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Section 80C (₹)</Text>
            <TextInput
              style={styles.input}
              value={taxData.section80C}
              onChangeText={(text) => setTaxData({...taxData, section80C: text})}
              placeholder="150000"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Section 80D (₹)</Text>
            <TextInput
              style={styles.input}
              value={taxData.section80D}
              onChangeText={(text) => setTaxData({...taxData, section80D: text})}
              placeholder="25000"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </>
      )}

      <Pressable style={styles.calculateButton} onPress={calculateTax}>
        <Text style={styles.calculateButtonText}>Calculate Tax</Text>
      </Pressable>

      {taxData.result && (
        <View style={styles.resultContainer}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Taxable Income:</Text>
            <Text style={styles.resultValue}>₹{taxData.result.taxableIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Tax Payable:</Text>
            <Text style={[styles.resultValue, {color: '#ef4444'}]}>₹{taxData.result.tax.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Net Income:</Text>
            <Text style={[styles.resultValue, {color: '#10b981', fontSize: 18, fontWeight: '800'}]}>₹{taxData.result.netIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Effective Tax Rate:</Text>
            <Text style={styles.resultValue}>{taxData.result.effectiveRate}%</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderRetirementPlanner = () => (
    <View style={styles.calculatorContainer}>
      <Text style={styles.calculatorTitle}>Retirement Planner</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Current Age</Text>
        <TextInput
          style={styles.input}
          value={retirementData.currentAge}
          onChangeText={(text) => setRetirementData({...retirementData, currentAge: text})}
          placeholder="30"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Retirement Age</Text>
        <TextInput
          style={styles.input}
          value={retirementData.retirementAge}
          onChangeText={(text) => setRetirementData({...retirementData, retirementAge: text})}
          placeholder="60"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Current Monthly Expenses (₹)</Text>
        <TextInput
          style={styles.input}
          value={retirementData.monthlyExpenses}
          onChangeText={(text) => setRetirementData({...retirementData, monthlyExpenses: text})}
          placeholder="50000"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Expected Inflation (% p.a.)</Text>
        <TextInput
          style={styles.input}
          value={retirementData.inflation}
          onChangeText={(text) => setRetirementData({...retirementData, inflation: text})}
          placeholder="6"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Expected Return (% p.a.)</Text>
        <TextInput
          style={styles.input}
          value={retirementData.expectedReturn}
          onChangeText={(text) => setRetirementData({...retirementData, expectedReturn: text})}
          placeholder="12"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Current Savings (₹)</Text>
        <TextInput
          style={styles.input}
          value={retirementData.currentSavings}
          onChangeText={(text) => setRetirementData({...retirementData, currentSavings: text})}
          placeholder="500000"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <Pressable style={styles.calculateButton} onPress={calculateRetirement}>
        <Text style={styles.calculateButtonText}>Plan Retirement</Text>
      </Pressable>

      {retirementData.result && (
        <View style={styles.resultContainer}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Years to Retirement:</Text>
            <Text style={styles.resultValue}>{retirementData.result.yearsToRetirement} years</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Future Monthly Expenses:</Text>
            <Text style={styles.resultValue}>₹{retirementData.result.futureMonthlyExpenses.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Corpus Needed:</Text>
            <Text style={[styles.resultValue, {color: '#059669', fontSize: 18, fontWeight: '800'}]}>₹{retirementData.result.corpusNeeded.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Current Savings Future Value:</Text>
            <Text style={styles.resultValue}>₹{retirementData.result.currentSavingsFutureValue.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Monthly SIP Required:</Text>
            <Text style={[styles.resultValue, {color: '#10b981', fontSize: 16, fontWeight: '700'}]}>₹{retirementData.result.monthlySIPRequired.toLocaleString()}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderSIPCalculator = () => (
    <View style={styles.calculatorContainer}>
      <Text style={styles.calculatorTitle}>SIP Calculator</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Monthly Investment (₹)</Text>
        <TextInput
          style={styles.input}
          value={sipData.monthlyAmount}
          onChangeText={(text) => setSipData({...sipData, monthlyAmount: text})}
          placeholder="5000"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Investment Period (Years)</Text>
        <TextInput
          style={styles.input}
          value={sipData.years}
          onChangeText={(text) => setSipData({...sipData, years: text})}
          placeholder="10"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Expected Return (% p.a.)</Text>
        <TextInput
          style={styles.input}
          value={sipData.expectedReturn}
          onChangeText={(text) => setSipData({...sipData, expectedReturn: text})}
          placeholder="12"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <Pressable style={styles.calculateButton} onPress={calculateSIP}>
        <Text style={styles.calculateButtonText}>Calculate</Text>
      </Pressable>

      {sipData.result && (
        <View style={styles.resultContainer}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Future Value:</Text>
            <Text style={styles.resultValue}>₹{sipData.result.futureValue.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Investment:</Text>
            <Text style={styles.resultValue}>₹{sipData.result.totalInvestment.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Gains:</Text>
            <Text style={[styles.resultValue, {color: '#10b981'}]}>₹{sipData.result.totalGains.toLocaleString()}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderLoanCalculator = () => (
    <View style={styles.calculatorContainer}>
      <Text style={styles.calculatorTitle}>Loan Calculator</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Loan Amount (₹)</Text>
        <TextInput
          style={styles.input}
          value={loanData.loanAmount}
          onChangeText={(text) => setLoanData({...loanData, loanAmount: text})}
          placeholder="1000000"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Interest Rate (% p.a.)</Text>
        <TextInput
          style={styles.input}
          value={loanData.interestRate}
          onChangeText={(text) => setLoanData({...loanData, interestRate: text})}
          placeholder="8.5"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tenure (Years)</Text>
        <TextInput
          style={styles.input}
          value={loanData.tenure}
          onChangeText={(text) => setLoanData({...loanData, tenure: text})}
          placeholder="20"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <Pressable style={styles.calculateButton} onPress={calculateLoan}>
        <Text style={styles.calculateButtonText}>Calculate EMI</Text>
      </Pressable>

      {loanData.result && (
        <View style={styles.resultContainer}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Monthly EMI:</Text>
            <Text style={[styles.resultValue, {color: '#10b981', fontSize: 18, fontWeight: '800'}]}>₹{loanData.result.emi.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Amount:</Text>
            <Text style={styles.resultValue}>₹{loanData.result.totalAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Interest:</Text>
            <Text style={styles.resultValue}>₹{loanData.result.totalInterest.toLocaleString()}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderFDCalculator = () => (
    <View style={styles.calculatorContainer}>
      <Text style={styles.calculatorTitle}>Fixed Deposit Calculator</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Principal Amount (₹)</Text>
        <TextInput
          style={styles.input}
          value={fdData.principal}
          onChangeText={(text) => setFdData({...fdData, principal: text})}
          placeholder="100000"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Interest Rate (% p.a.)</Text>
        <TextInput
          style={styles.input}
          value={fdData.rate}
          onChangeText={(text) => setFdData({...fdData, rate: text})}
          placeholder="6.5"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Time Period (Years)</Text>
        <TextInput
          style={styles.input}
          value={fdData.years}
          onChangeText={(text) => setFdData({...fdData, years: text})}
          placeholder="5"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <Pressable style={styles.calculateButton} onPress={calculateFD}>
        <Text style={styles.calculateButtonText}>Calculate</Text>
      </Pressable>

      {fdData.result && (
        <View style={styles.resultContainer}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Maturity Amount:</Text>
            <Text style={[styles.resultValue, {color: '#10b981', fontSize: 18, fontWeight: '800'}]}>₹{fdData.result.maturityAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Principal:</Text>
            <Text style={styles.resultValue}>₹{fdData.result.principal.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Interest Earned:</Text>
            <Text style={styles.resultValue}>₹{fdData.result.interest.toLocaleString()}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderPPFCalculator = () => (
    <View style={styles.calculatorContainer}>
      <Text style={styles.calculatorTitle}>PPF Calculator</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Monthly Investment (₹)</Text>
        <TextInput
          style={styles.input}
          value={ppfData.monthlyAmount}
          onChangeText={(text) => setPpfData({...ppfData, monthlyAmount: text})}
          placeholder="12500"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Investment Period (Years)</Text>
        <TextInput
          style={styles.input}
          value={ppfData.years}
          onChangeText={(text) => setPpfData({...ppfData, years: text})}
          placeholder="15"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Current PPF Rate: 7.1% p.a.</Text>
      </View>

      <Pressable style={styles.calculateButton} onPress={calculatePPF}>
        <Text style={styles.calculateButtonText}>Calculate</Text>
      </Pressable>

      {ppfData.result && (
        <View style={styles.resultContainer}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Maturity Amount:</Text>
            <Text style={[styles.resultValue, {color: '#10b981', fontSize: 18, fontWeight: '800'}]}>₹{ppfData.result.maturityAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Investment:</Text>
            <Text style={styles.resultValue}>₹{ppfData.result.totalInvestment.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Interest Earned:</Text>
            <Text style={styles.resultValue}>₹{ppfData.result.interest.toLocaleString()}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderCalculator = () => {
    switch(activeCalculator) {
      case 1: return renderSIPCalculator();
      case 2: return renderLoanCalculator();
      case 3: return renderFDCalculator();
      case 4: return renderPPFCalculator();
      case 5: return renderTaxCalculator();
      case 6: return renderRetirementPlanner();
      default: return <Text>Calculator not available</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#10b981" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Finance Tools</Text>
        <Pressable style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </Pressable>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <ScrollView 
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Financial Calculators</Text>
            <Text style={styles.welcomeSubtitle}>Plan your investments and loans with precision</Text>
          </View>

          {/* Calculator Tools Grid */}
          <View style={styles.toolsGrid}>
            {calculatorTools.map((tool) => (
              <Pressable 
                key={tool.id} 
                style={[styles.toolCard, { backgroundColor: tool.bgColor }]}
                onPress={() => openCalculator(tool.id)}
                android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
              >
                <View style={[styles.toolIconContainer, { backgroundColor: tool.iconColor }]}>
                  <Text style={styles.toolIcon}>{tool.icon}</Text>
                </View>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </Pressable>
            ))}
          </View>

          {/* Quick Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
            <View style={styles.tipCard}>
              <Text style={styles.tipText}>• Start SIP early to benefit from compound interest</Text>
              <Text style={styles.tipText}>• Compare loan offers from multiple banks</Text>
              <Text style={styles.tipText}>• PPF has 15-year lock-in with tax benefits</Text>
              <Text style={styles.tipText}>• FDs are safe but offer lower returns than equity</Text>
              <Text style={styles.tipText}>• Plan retirement early for a comfortable future</Text>
              <Text style={styles.tipText}>• Choose tax regime based on your deductions</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Calculator Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeCalculator}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable style={styles.closeButton} onPress={closeCalculator}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {renderCalculator()}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10b981",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#10b981",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontWeight: "700",
    color: "#ffffff",
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  notificationIcon: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  welcomeSection: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#10b981",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  toolCard: {
    width: "47%",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    position: 'relative',
  },
  toolIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolIcon: {
    fontSize: 28,
    color: '#ffffff',
  },
  toolTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 6,
  },
  toolDescription: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
  },
  tipsSection: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 15,
  },
  tipCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 8,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  modalHeader: {
    backgroundColor: "#10b981",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10b981",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  calculatorContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    elevation: 3,
  },
  calculatorTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#10b981",
    textAlign: "center",
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  infoBox: {
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  infoText: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "600",
  },
  calculateButton: {
    backgroundColor: "#10b981",
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  calculateButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  resultContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  resultLabel: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  resultValue: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "700",
  },
  // Tax Calculator specific styles
  regimeSelector: {
    marginBottom: 20,
  },
  regimeButtons: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    padding: 4,
  },
  regimeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  regimeButtonActive: {
    backgroundColor: '#10b981',
  },
  regimeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  regimeButtonTextActive: {
    color: '#ffffff',
  },
});

export default FinanceCalculator;