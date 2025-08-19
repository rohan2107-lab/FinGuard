import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
  RefreshControl,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Switch,
  Image,
  Picker,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Mock API service (replace with your actual API calls)
const BudgetService = {
  async getUserBudgets(params) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        budgets: [
          {
            _id: '1',
            title: 'Monthly Expenses',
            description: 'Track monthly spending and household expenses',
            amount: 2500,
            currency: 'USD',
            category: 'Personal',
            status: 'active',
            isPublic: false,
            tags: ['household', 'monthly'],
            videos: [
              { 
                videoId: { _id: 'v1', title: 'Expense Tracking Tips', description: 'How to track expenses', cloudinaryUrl: 'https://example.com/video1.mp4' },
                title: 'Expense Tracking Tips',
                description: 'Learn how to track expenses effectively',
                addedAt: new Date().toISOString(),
                isActive: true
              }
            ],
            createdBy: { _id: 'u1', fullName: 'John Doe', email: 'john@example.com' },
            createdAt: new Date().toISOString(),
          },
          {
            _id: '2',
            title: 'Vacation Fund',
            description: 'Saving for summer vacation to Europe',
            amount: 5000,
            currency: 'USD',
            category: 'Travel',
            status: 'active',
            isPublic: true,
            tags: ['vacation', 'europe', 'travel'],
            videos: [
              {
                videoId: { _id: 'v2', title: 'Travel Budget Planning', description: 'Plan your travel budget', cloudinaryUrl: 'https://example.com/video2.mp4' },
                title: 'Travel Budget Planning',
                description: 'How to plan your travel budget effectively',
                addedAt: new Date().toISOString(),
                isActive: true
              },
              {
                videoId: { _id: 'v3', title: 'Money Saving Tips', description: 'Save money for travel', cloudinaryUrl: 'https://example.com/video3.mp4' },
                title: 'Money Saving Tips',
                description: 'Tips to save money for your dream vacation',
                addedAt: new Date().toISOString(),
                isActive: true
              }
            ],
            createdBy: { _id: 'u1', fullName: 'John Doe', email: 'john@example.com' },
            createdAt: new Date().toISOString(),
          },
          {
            _id: '3',
            title: 'Emergency Fund',
            description: 'Emergency savings for unexpected expenses',
            amount: 10000,
            currency: 'USD',
            category: 'Savings',
            status: 'active',
            isPublic: false,
            tags: ['emergency', 'savings'],
            videos: [],
            createdBy: { _id: 'u1', fullName: 'John Doe', email: 'john@example.com' },
            createdAt: new Date().toISOString(),
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalBudgets: 3,
          hasNextPage: false,
          hasPrevPage: false
        },
      },
    };
  },

  async getPublicBudgets(params) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      data: {
        budgets: [
          {
            _id: '4',
            title: 'Fitness Journey Budget',
            description: 'Budget for gym membership and fitness equipment',
            amount: 1200,
            currency: 'USD',
            category: 'Health',
            status: 'active',
            isPublic: true,
            tags: ['fitness', 'health'],
            videos: [],
            createdBy: { _id: 'u2', fullName: 'Jane Smith', email: 'jane@example.com' },
            createdAt: new Date().toISOString(),
          },
          {
            _id: '2',
            title: 'Vacation Fund',
            description: 'Saving for summer vacation to Europe',
            amount: 5000,
            currency: 'USD',
            category: 'Travel',
            status: 'active',
            isPublic: true,
            tags: ['vacation', 'europe', 'travel'],
            videos: [
              {
                videoId: { _id: 'v2', title: 'Travel Budget Planning', cloudinaryUrl: 'https://example.com/video2.mp4' },
                title: 'Travel Budget Planning',
              }
            ],
            createdBy: { _id: 'u1', fullName: 'John Doe', email: 'john@example.com' },
            createdAt: new Date().toISOString(),
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalBudgets: 2,
        }
      }
    };
  },

  async createBudget(budgetData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { 
      success: true, 
      data: { 
        _id: Date.now().toString(), 
        ...budgetData,
        createdBy: { _id: 'u1', fullName: 'John Doe', email: 'john@example.com' },
        videos: [],
        status: 'active',
        createdAt: new Date().toISOString(),
      } 
    };
  },

  async updateBudget(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data: { _id: id, ...updateData } };
  },

  async deleteBudget(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },

  async addVideoToBudget(budgetId, videoData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { 
      success: true, 
      data: {
        _id: budgetId,
        videos: [
          {
            videoId: { _id: Date.now().toString(), title: videoData.title, cloudinaryUrl: 'https://example.com/video.mp4' },
            title: videoData.title,
            description: videoData.description,
            addedAt: new Date().toISOString(),
            isActive: true
          }
        ]
      }
    };
  },

  async removeVideoFromBudget(budgetId, videoId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data: { _id: budgetId } };
  },

  async getBudgetById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      data: {
        _id: id,
        title: 'Sample Budget',
        description: 'A sample budget for demonstration',
        amount: 3000,
        currency: 'USD',
        category: 'Personal',
        status: 'active',
        isPublic: false,
        tags: ['sample'],
        videos: [],
        createdBy: { _id: 'u1', fullName: 'John Doe', email: 'john@example.com' },
        createdAt: new Date().toISOString(),
      }
    };
  },

  async getBudgetStats() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      data: {
        overview: {
          totalBudgets: 8,
          totalAmount: 25600,
          averageAmount: 3200,
          totalVideos: 15,
        },
        categoryBreakdown: [
          { _id: 'Personal', count: 3, totalAmount: 8500 },
          { _id: 'Travel', count: 2, totalAmount: 7000 },
          { _id: 'Business', count: 2, totalAmount: 6500 },
          { _id: 'Health', count: 1, totalAmount: 3600 },
        ],
        statusBreakdown: [
          { _id: 'active', count: 6, totalAmount: 22100 },
          { _id: 'completed', count: 2, totalAmount: 3500 },
        ]
      },
    };
  },
};

const Budgeting = () => {
  const [budgets, setBudgets] = useState([]);
  const [publicBudgets, setPublicBudgets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('budgets');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showBudgetDetailModal, setShowBudgetDetailModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    isPublic: null,
  });

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'USD',
    category: '',
    isPublic: false,
    tags: '',
    startDate: '',
    endDate: '',
    metadata: '',
  });

  const [videoFormData, setVideoFormData] = useState({
    videoId: '',
    title: '',
    description: '',
  });

  const categories = ['Personal', 'Travel', 'Business', 'Education', 'Health', 'Entertainment', 'Savings', 'Investment'];
  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];
  const statuses = ['active', 'completed', 'paused', 'cancelled'];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadBudgets(),
      loadStats(),
      activeTab === 'discover' && loadPublicBudgets(),
    ]);
  };

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const response = await BudgetService.getUserBudgets({
        page: currentPage,
        limit: 10,
        ...filters,
      });
      if (response.success) {
        setBudgets(response.data.budgets);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const loadPublicBudgets = async () => {
    try {
      const response = await BudgetService.getPublicBudgets({
        page: 1,
        limit: 20,
        category: filters.category,
      });
      if (response.success) {
        setPublicBudgets(response.data.budgets);
      }
    } catch (error) {
      console.error('Failed to load public budgets:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await BudgetService.getBudgetStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  }, [activeTab]);

  const handleCreateBudget = async () => {
    if (!formData.title || !formData.amount || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields (Title, Amount, Category)');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    try {
      const budgetData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        metadata: formData.metadata ? JSON.parse(formData.metadata) : {},
        startDate: formData.startDate || new Date().toISOString(),
      };

      const response = await BudgetService.createBudget(budgetData);
      if (response.success) {
        setBudgets(prev => [response.data, ...prev]);
        setShowCreateModal(false);
        resetForm();
        Alert.alert('Success', 'Budget created successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create budget. Please check your input.');
    }
  };

  const handleEditBudget = async () => {
    if (!selectedBudget) return;

    try {
      const updateData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        metadata: formData.metadata ? JSON.parse(formData.metadata) : {},
      };

      const response = await BudgetService.updateBudget(selectedBudget._id, updateData);
      if (response.success) {
        setBudgets(prev =>
          prev.map(budget =>
            budget._id === selectedBudget._id ? { ...budget, ...response.data } : budget
          )
        );
        setShowEditModal(false);
        setSelectedBudget(null);
        resetForm();
        Alert.alert('Success', 'Budget updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update budget');
    }
  };

  const handleDeleteBudget = (budget) => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete "${budget.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await BudgetService.deleteBudget(budget._id);
              if (response.success) {
                setBudgets(prev => prev.filter(b => b._id !== budget._id));
                Alert.alert('Success', 'Budget deleted successfully');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete budget');
            }
          },
        },
      ]
    );
  };

  const handleAddVideo = async () => {
    if (!videoFormData.videoId || !videoFormData.title) {
      Alert.alert('Error', 'Please provide video ID and title');
      return;
    }

    try {
      const response = await BudgetService.addVideoToBudget(selectedBudget._id, videoFormData);
      if (response.success) {
        setBudgets(prev =>
          prev.map(budget =>
            budget._id === selectedBudget._id 
              ? { ...budget, videos: [...budget.videos, ...response.data.videos] }
              : budget
          )
        );
        setShowVideoModal(false);
        setVideoFormData({ videoId: '', title: '', description: '' });
        Alert.alert('Success', 'Video added to budget successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add video to budget');
    }
  };

  const handleRemoveVideo = (budgetId, videoId) => {
    Alert.alert(
      'Remove Video',
      'Are you sure you want to remove this video from the budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await BudgetService.removeVideoFromBudget(budgetId, videoId);
              if (response.success) {
                setBudgets(prev =>
                  prev.map(budget =>
                    budget._id === budgetId
                      ? { ...budget, videos: budget.videos.filter(v => v.videoId._id !== videoId) }
                      : budget
                  )
                );
                Alert.alert('Success', 'Video removed from budget');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to remove video');
            }
          },
        },
      ]
    );
  };

  const openEditModal = (budget) => {
    setSelectedBudget(budget);
    setFormData({
      title: budget.title,
      description: budget.description || '',
      amount: budget.amount.toString(),
      currency: budget.currency,
      category: budget.category,
      isPublic: budget.isPublic,
      tags: budget.tags ? budget.tags.join(', ') : '',
      startDate: budget.startDate || '',
      endDate: budget.endDate || '',
      metadata: budget.metadata ? JSON.stringify(budget.metadata) : '',
    });
    setShowEditModal(true);
  };

  const openBudgetDetail = (budget) => {
    setSelectedBudget(budget);
    setShowBudgetDetailModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      amount: '',
      currency: 'USD',
      category: '',
      isPublic: false,
      tags: '',
      startDate: '',
      endDate: '',
      metadata: '',
    });
  };

  const applyFilters = () => {
    loadBudgets();
  };

  const clearFilters = () => {
    setFilters({ category: '', status: '', isPublic: null });
    setSearchQuery('');
  };

  const filteredBudgets = (activeTab === 'discover' ? publicBudgets : budgets).filter(budget =>
    budget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    budget.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (budget.tags && budget.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const BudgetCard = ({ budget, isPublic = false }) => (
    <TouchableOpacity 
      style={styles.budgetCard}
      onPress={() => openBudgetDetail(budget)}
    >
      <View style={styles.budgetHeader}>
        <View style={styles.budgetTitleContainer}>
          <Text style={styles.budgetTitle}>{budget.title}</Text>
          {budget.isPublic && (
            <View style={styles.publicBadge}>
              <Text style={styles.publicBadgeText}>Public</Text>
            </View>
          )}
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(budget.status) }]}>
            <Text style={styles.statusBadgeText}>{budget.status}</Text>
          </View>
        </View>
        <Text style={styles.budgetAmount}>
          {formatCurrency(budget.amount, budget.currency)}
        </Text>
      </View>
      
      {budget.description ? (
        <Text style={styles.budgetDescription} numberOfLines={2}>
          {budget.description}
        </Text>
      ) : null}
      
      <View style={styles.budgetMeta}>
        <Text style={styles.budgetCategory}>{budget.category}</Text>
        <Text style={styles.budgetVideos}>
          {budget.videos?.length || 0} videos
        </Text>
        <Text style={styles.budgetDate}>
          {formatDate(budget.createdAt)}
        </Text>
      </View>

      {budget.tags && budget.tags.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
          {budget.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {isPublic && (
        <View style={styles.creatorInfo}>
          <Text style={styles.creatorText}>By {budget.createdBy?.fullName}</Text>
        </View>
      )}
      
      {!isPublic && (
        <View style={styles.budgetActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              setSelectedBudget(budget);
              setShowVideoModal(true);
            }}
          >
            <Text style={styles.actionButtonText}>Add Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              openEditModal(budget);
            }}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteBudget(budget);
            }}
          >
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'completed': return '#007bff';
      case 'paused': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const StatsCard = ({ title, value, subtitle }) => (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={styles.statsValue}>{value}</Text>
      {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
    </View>
  );

  const FilterModal = ({ visible, onClose }) => (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity onPress={() => { applyFilters(); onClose(); }}>
            <Text style={styles.modalSave}>Apply</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryContainer}>
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    filters.category === '' && styles.categoryChipSelected,
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, category: '' }))}
                >
                  <Text style={[
                    styles.categoryChipText,
                    filters.category === '' && styles.categoryChipTextSelected,
                  ]}>All</Text>
                </TouchableOpacity>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      filters.category === category && styles.categoryChipSelected,
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, category }))}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        filters.category === category && styles.categoryChipTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryContainer}>
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    filters.status === '' && styles.categoryChipSelected,
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, status: '' }))}
                >
                  <Text style={[
                    styles.categoryChipText,
                    filters.status === '' && styles.categoryChipTextSelected,
                  ]}>All</Text>
                </TouchableOpacity>
                {statuses.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.categoryChip,
                      filters.status === status && styles.categoryChipSelected,
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, status }))}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        filters.status === status && styles.categoryChipTextSelected,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Visibility</Text>
            <View style={styles.visibilityOptions}>
              <TouchableOpacity
                style={[
                  styles.visibilityOption,
                  filters.isPublic === null && styles.visibilityOptionSelected,
                ]}
                onPress={() => setFilters(prev => ({ ...prev, isPublic: null }))}
              >
                <Text style={[
                  styles.visibilityOptionText,
                  filters.isPublic === null && styles.visibilityOptionTextSelected,
                ]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.visibilityOption,
                  filters.isPublic === true && styles.visibilityOptionSelected,
                ]}
                onPress={() => setFilters(prev => ({ ...prev, isPublic: true }))}
              >
                <Text style={[
                  styles.visibilityOptionText,
                  filters.isPublic === true && styles.visibilityOptionTextSelected,
                ]}>Public</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.visibilityOption,
                  filters.isPublic === false && styles.visibilityOptionSelected,
                ]}
                onPress={() => setFilters(prev => ({ ...prev, isPublic: false }))}
              >
                <Text style={[
                  styles.visibilityOptionText,
                  filters.isPublic === false && styles.visibilityOptionTextSelected,
                ]}>Private</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => {
              clearFilters();
              onClose();
            }}
          >
            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const FormModal = ({ visible, onClose, onSubmit, title }) => (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onSubmit}>
            <Text style={styles.modalSave}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Title *</Text>
            <TextInput
              style={styles.formInput}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="Enter budget title"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Enter description"
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 2 }]}>
              <Text style={styles.formLabel}>Amount *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.amount}
                onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.formLabel}>Currency</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>{formData.currency}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      formData.category === category && styles.categoryChipSelected,
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, category }))}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        formData.category === category && styles.categoryChipTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.formLabel}>Start Date</Text>
              <TextInput
                style={styles.formInput}
                value={formData.startDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, startDate: text }))}
                placeholder="YYYY-MM-DD"
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.formLabel}>End Date</Text>
              <TextInput
                style={styles.formInput}
                value={formData.endDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, endDate: text }))}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Tags</Text>
            <TextInput
              style={styles.formInput}
              value={formData.tags}
              onChangeText={(text) => setFormData(prev => ({ ...prev, tags: text }))}
              placeholder="Enter tags separated by commas"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Metadata (JSON)</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={formData.metadata}
              onChangeText={(text) => setFormData(prev => ({ ...prev, metadata: text }))}
              placeholder='{"key": "value"}'
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.formGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.formLabel}>Make Public</Text>
              <Switch
                value={formData.isPublic}
                onValueChange={(value) => setFormData(prev => ({ ...prev, isPublic: value }))}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const VideoModal = ({ visible, onClose }) => (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Video to Budget</Text>
          <TouchableOpacity onPress={handleAddVideo}>
            <Text style={styles.modalSave}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Video ID *</Text>
            <TextInput
              style={styles.formInput}
              value={videoFormData.videoId}
              onChangeText={(text) => setVideoFormData(prev => ({ ...prev, videoId: text }))}
              placeholder="Enter video ID"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Title *</Text>
            <TextInput
              style={styles.formInput}
              value={videoFormData.title}
              onChangeText={(text) => setVideoFormData(prev => ({ ...prev, title: text }))}
              placeholder="Enter video title"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={videoFormData.description}
              onChangeText={(text) => setVideoFormData(prev => ({ ...prev, description: text }))}
              placeholder="Enter video description"
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const BudgetDetailModal = ({ visible, onClose }) => (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancel}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Budget Details</Text>
          <View style={{ width: 40 }} />
        </View>
        
        {selectedBudget && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>{selectedBudget.title}</Text>
              <Text style={styles.detailAmount}>
                {formatCurrency(selectedBudget.amount, selectedBudget.currency)}
              </Text>
            </View>

            <View style={styles.detailInfo}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category:</Text>
                <Text style={styles.detailValue}>{selectedBudget.category}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedBudget.status) }]}>
                  <Text style={styles.statusBadgeText}>{selectedBudget.status}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Visibility:</Text>
                <Text style={styles.detailValue}>{selectedBudget.isPublic ? 'Public' : 'Private'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Created:</Text>
                <Text style={styles.detailValue}>{formatDate(selectedBudget.createdAt)}</Text>
              </View>
              {selectedBudget.createdBy && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Creator:</Text>
                  <Text style={styles.detailValue}>{selectedBudget.createdBy.fullName}</Text>
                </View>
              )}
            </View>

            {selectedBudget.description && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.detailDescription}>{selectedBudget.description}</Text>
              </View>
            )}

            {selectedBudget.tags && selectedBudget.tags.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {selectedBudget.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Videos ({selectedBudget.videos?.length || 0})</Text>
              {selectedBudget.videos && selectedBudget.videos.length > 0 ? (
                selectedBudget.videos.map((video, index) => (
                  <View key={index} style={styles.videoItem}>
                    <View style={styles.videoInfo}>
                      <Text style={styles.videoTitle}>{video.title}</Text>
                      {video.description && (
                        <Text style={styles.videoDescription}>{video.description}</Text>
                      )}
                      <Text style={styles.videoDate}>Added: {formatDate(video.addedAt)}</Text>
                    </View>
                    {activeTab === 'budgets' && (
                      <TouchableOpacity
                        style={styles.removeVideoButton}
                        onPress={() => handleRemoveVideo(selectedBudget._id, video.videoId._id)}
                      >
                        <Text style={styles.removeVideoText}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.noVideosText}>No videos added to this budget</Text>
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budget Manager</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setShowCreateModal(true);
            }}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'budgets' && styles.activeTab]}
          onPress={() => {
            setActiveTab('budgets');
            loadBudgets();
          }}
        >
          <Text style={[styles.tabText, activeTab === 'budgets' && styles.activeTabText]}>
            My Budgets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
          onPress={() => {
            setActiveTab('discover');
            loadPublicBudgets();
          }}
        >
          <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>
            Discover
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => {
            setActiveTab('stats');
            loadStats();
          }}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
            Statistics
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {(activeTab === 'budgets' || activeTab === 'discover') ? (
        <>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={`Search ${activeTab === 'discover' ? 'public' : ''} budgets...`}
            />
          </View>

          {/* Budget List */}
          <FlatList
            data={filteredBudgets}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <BudgetCard budget={item} isPublic={activeTab === 'discover'} />}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007AFF" />
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {activeTab === 'discover' ? 'No public budgets found' : 'No budgets found'}
                  </Text>
                  <Text style={styles.emptySubtext}>
                    {activeTab === 'discover' 
                      ? 'Try adjusting your search or filters' 
                      : 'Create your first budget to get started'
                    }
                  </Text>
                </View>
              )
            }
          />
        </>
      ) : (
        <ScrollView
          style={styles.statsContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {stats && (
            <>
              {/* Overview Stats */}
              <Text style={styles.sectionTitle}>Overview</Text>
              <View style={styles.statsGrid}>
                <StatsCard
                  title="Total Budgets"
                  value={stats.overview.totalBudgets}
                />
                <StatsCard
                  title="Total Amount"
                  value={formatCurrency(stats.overview.totalAmount)}
                />
                <StatsCard
                  title="Average Budget"
                  value={formatCurrency(stats.overview.averageAmount)}
                />
                <StatsCard
                  title="Total Videos"
                  value={stats.overview.totalVideos}
                />
              </View>

              {/* Category Breakdown */}
              <Text style={styles.sectionTitle}>By Category</Text>
              {stats.categoryBreakdown.map((category) => (
                <View key={category._id} style={styles.categoryStats}>
                  <View style={styles.categoryStatsHeader}>
                    <Text style={styles.categoryStatsTitle}>{category._id}</Text>
                    <Text style={styles.categoryStatsAmount}>
                      {formatCurrency(category.totalAmount)}
                    </Text>
                  </View>
                  <Text style={styles.categoryStatsCount}>
                    {category.count} budget{category.count !== 1 ? 's' : ''}
                  </Text>
                </View>
              ))}

              {/* Status Breakdown */}
              <Text style={styles.sectionTitle}>By Status</Text>
              {stats.statusBreakdown.map((status) => (
                <View key={status._id} style={styles.categoryStats}>
                  <View style={styles.categoryStatsHeader}>
                    <View style={styles.statusWithBadge}>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status._id) }]}>
                        <Text style={styles.statusBadgeText}>{status._id}</Text>
                      </View>
                    </View>
                    <Text style={styles.categoryStatsAmount}>
                      {formatCurrency(status.totalAmount)}
                    </Text>
                  </View>
                  <Text style={styles.categoryStatsCount}>
                    {status.count} budget{status.count !== 1 ? 's' : ''}
                  </Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}

      {/* Modals */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
      />
      
      <FormModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBudget}
        title="Create Budget"
      />
      
      <FormModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBudget(null);
        }}
        onSubmit={handleEditBudget}
        title="Edit Budget"
      />

      <VideoModal
        visible={showVideoModal}
        onClose={() => {
          setShowVideoModal(false);
          setVideoFormData({ videoId: '', title: '', description: '' });
        }}
      />

      <BudgetDetailModal
        visible={showBudgetDetailModal}
        onClose={() => {
          setShowBudgetDetailModal(false);
          setSelectedBudget(null);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  filterButtonText: {
    color: '#495057',
    fontWeight: '600',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  listContainer: {
    padding: 16,
  },
  budgetCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  budgetTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginRight: 8,
  },
  publicBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  publicBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  budgetAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  budgetDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
    lineHeight: 20,
  },
  budgetMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetCategory: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  budgetVideos: {
    fontSize: 14,
    color: '#6c757d',
  },
  budgetDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  tagsContainer: {
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  creatorInfo: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  creatorText: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  budgetActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
    borderColor: '#f5c6cb',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#495057',
  },
  deleteButtonText: {
    color: '#dc3545',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  statsContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
    marginTop: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: (width - 48) / 2,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  statsSubtitle: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  categoryStats: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryStatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  statusWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryStatsAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  categoryStatsCount: {
    fontSize: 14,
    color: '#6c757d',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalCancel: {
    fontSize: 16,
    color: '#dc3545',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  modalSave: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  pickerText: {
    fontSize: 16,
    color: '#495057',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  categoryChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#495057',
  },
  categoryChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visibilityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  visibilityOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  visibilityOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  visibilityOptionText: {
    fontSize: 14,
    color: '#495057',
  },
  visibilityOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  clearFiltersButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  clearFiltersText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  detailAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
  },
  detailInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '600',
  },
  detailDescription: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 22,
  },
  videoItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  videoDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  removeVideoButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeVideoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Budgeting;