import * as React from "react";
import { StyleSheet, Text, View, Image, Pressable, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, Fonts, FontSize } from "../../../constants/GlobleStyle";

const FinShort = () => {
  const videoData = [
    {
      id: 1,
      title: "Smart Budgeting Tips",
      duration: "3:45",
      views: "12K",
      thumbnail: "https://via.placeholder.com/300x180/87CEEB/FFFFFF?text=Budgeting",
      category: "Budgeting"
    },
    {
      id: 2,
      title: "Investment Basics for Beginners",
      duration: "5:20",
      views: "25K",
      thumbnail: "https://via.placeholder.com/300x180/4169E1/FFFFFF?text=Investment",
      category: "Investment"
    },
    {
      id: 3,
      title: "Emergency Fund Planning",
      duration: "4:15",
      views: "8.5K",
      thumbnail: "https://via.placeholder.com/300x180/1E90FF/FFFFFF?text=Emergency",
      category: "Savings"
    },
    {
      id: 4,
      title: "Credit Score Improvement",
      duration: "6:30",
      views: "18K",
      thumbnail: "https://via.placeholder.com/300x180/00BFFF/FFFFFF?text=Credit",
      category: "Credit"
    },
    {
      id: 5,
      title: "Retirement Planning 101",
      duration: "7:45",
      views: "32K",
      thumbnail: "https://via.placeholder.com/300x180/87CEEB/FFFFFF?text=Retirement",
      category: "Planning"
    },
    {
      id: 6,
      title: "Tax Saving Strategies",
      duration: "4:50",
      views: "15K",
      thumbnail: "https://via.placeholder.com/300x180/4169E1/FFFFFF?text=Tax",
      category: "Tax"
    }
  ];

  const categories = ["All", "Budgeting", "Investment", "Savings", "Credit", "Planning", "Tax"];
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredVideos = selectedCategory === "All" 
    ? videoData 
    : videoData.filter(video => video.category === selectedCategory);

  const renderVideoCard = ({ item }) => (
    <Pressable style={styles.videoCard} onPress={() => {}}>
      <View style={styles.thumbnailContainer}>
        <View style={styles.thumbnail}>
          <Text style={styles.thumbnailText}>{item.category}</Text>
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
        <View style={styles.playButton}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.videoStats}>{item.views} views</Text>
      </View>
    </Pressable>
  );

  const renderCategoryItem = ({ item }) => (
    <Pressable 
      style={[
        styles.categoryChip, 
        selectedCategory === item && styles.categoryChipActive
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item && styles.categoryTextActive
      ]}>
        {item}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        {/* Background */}
        <View style={styles.backgroundCard} />
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={styles.title}>FinShort</Text>
          <Pressable style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </Pressable>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📹</Text>
            <Text style={styles.statLabel}>Videos Watched</Text>
            <Text style={styles.statValue}>24</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statLabel}>Total Watch Time</Text>
            <Text style={styles.statValue}>2h 45m</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Videos List */}
        <View style={styles.videosSection}>
          <FlatList
            data={filteredVideos}
            renderItem={renderVideoCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.videosList}
            columnWrapperStyle={styles.videoRow}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.colorMediumseagreen || '#3CB371',
    flex: 1,
  },
  view: {
    flex: 1,
    backgroundColor: Color.colorMediumseagreen || '#3CB371',
    overflow: 'hidden',
  },
  backgroundCard: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -215,
    width: 430,
    height: 680,
    backgroundColor: Color.colorHoneydew || '#F0FFF0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 38,
    paddingTop: 20,
    marginBottom: 15,
  },
  backButton: {
    width: 19,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: Color.colorDarkslategray200 || '#2F4F4F',
    fontWeight: 'bold',
  },
  title: {
    fontSize: FontSize?.size_20 || 20,
    fontFamily: Fonts?.poppinsSemiBold || 'System',
    fontWeight: '600',
    color: Color.colorDarkslategray200 || '#2F4F4F',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  notificationButton: {
    width: 30,
    height: 30,
    backgroundColor: Color.colorHoneydew || '#F0FFF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    marginHorizontal: 30,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius:15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts?.poppinsRegular || 'System',
    color: Color.colorDarkslategray200 || '#2F4F4F',
    textAlign: 'center',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 14,
    fontFamily: Fonts?.poppinsSemiBold || 'System',
    fontWeight: '600',
    color: Color.colorWhite || '#FFFFFF',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Color.colorHoneydew || '#F0FFF0',
    marginHorizontal: 15,
  },
  categoriesSection: {
    marginBottom: 20,
  },
  categoriesList: {
    paddingHorizontal: 38,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 10,
    borderRadius:15,
  },
  categoryChipActive: {
    backgroundColor: Color.colorDeepskyblue || '#00BFFF',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: Fonts?.poppinsMedium || 'System',
    fontWeight: '500',
    color: Color.colorDarkslategray200 || '#2F4F4F',
  },
  categoryTextActive: {
    color: Color.colorWhite || '#FFFFFF',
  },
  videosSection: {
    flex: 1,
    paddingHorizontal: 25,
  },
  videosList: {
    paddingBottom: 20,
  },
  videoRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  videoCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius:10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 120,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: Color.colorDeepskyblue || '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailText: {
    fontSize: 16,
    fontFamily: Fonts?.poppinsSemiBold || 'System',
    fontWeight: '600',
    color: Color.colorWhite || '#FFFFFF',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius:4,
  },
  durationText: {
    fontSize: 10,
    color: Color.colorWhite || '#FFFFFF',
    fontFamily: Fonts?.poppinsRegular || 'System',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -15,
    marginLeft: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 12,
    color: Color.colorDarkslategray200 || '#2F4F4F',
    marginLeft: 2,
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontFamily: Fonts?.poppinsMedium || 'System',
    fontWeight: '500',
    color: Color.colorDarkslategray200 || '#2F4F4F',
    marginBottom: 5,
    lineHeight: 18,
  },
  videoStats: {
    fontSize: 12,
    fontFamily: Fonts?.poppinsRegular || 'System',
    color: Color.colorDarkslategray200 || '#2F4F4F',
    opacity: 0.7,
  },
});

export default FinShort;