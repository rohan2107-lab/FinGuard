import * as React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  FlatList, 
  Dimensions, 
  ActivityIndicator, 
  Alert,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, Fonts, FontSize } from "../../constants/GlobleStyle";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIDEO_HEIGHT = SCREEN_HEIGHT - 100; // Account for status bar and minimal UI

const FinShort = () => {
  const [videoData, setVideoData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);
  const flatListRef = React.useRef(null);

  // API configuration
  const API_BASE_URL = 'http://localhost:8000'; // Update this to your backend URL
  
  // Fetch videos from API
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/videos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform API data to match your component's expected format
      const transformedData = data.map((video, index) => ({
        id: video.id || index + 1,
        title: video.title || 'Untitled Video',
        description: video.description || 'Financial education content',
        duration: video.duration || '0:00',
        views: video.views || '0',
        likes: video.likes || '0',
        comments: video.comments || '0',
        shares: video.shares || '0',
        thumbnail: video.thumbnail || `https://via.placeholder.com/400x700/87CEEB/FFFFFF?text=${video.category || 'Video'}`,
        videoUrl: video.videoUrl || video.url || '',
        category: video.category || 'General',
        author: video.author || 'FinShort',
        isLiked: false,
        isFollowed: false,
      }));

      setVideoData(transformedData);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.message);
      Alert.alert(
        'Error',
        'Failed to load videos. Please check your internet connection and try again.',
        [
          { text: 'Retry', onPress: fetchVideos },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch videos on component mount
  React.useEffect(() => {
    fetchVideos();
  }, []);

  const handleLike = (videoId) => {
    setVideoData(prevData => 
      prevData.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              isLiked: !video.isLiked,
              likes: video.isLiked 
                ? (parseInt(video.likes.toString().replace('K', '000').replace('M', '000000')) - 1).toString()
                : (parseInt(video.likes.toString().replace('K', '000').replace('M', '000000')) + 1).toString()
            }
          : video
      )
    );
  };

  const handleFollow = (videoId) => {
    setVideoData(prevData => 
      prevData.map(video => 
        video.id === videoId 
          ? { ...video, isFollowed: !video.isFollowed }
          : video
      )
    );
  };

  const handleShare = (video) => {
    // Implement share functionality
    console.log('Share video:', video.title);
  };

  const handleComment = (video) => {
    // Navigate to comments screen
    console.log('Open comments for:', video.title);
  };

  const onViewableItemsChanged = React.useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVideoIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderVideoItem = ({ item, index }) => (
    <View style={styles.videoContainer}>
      {/* Video Background/Thumbnail */}
      <View style={styles.videoBackground}>
        <View style={[styles.thumbnail, { backgroundColor: Color.colorDeepskyblue || '#00BFFF' }]}>
          <Text style={styles.categoryText}>{item.category}</Text>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
        
        {/* Video duration overlay */}
        <View style={styles.durationOverlay}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>

      {/* Left side content */}
      <View style={styles.leftContent}>
        <View style={styles.videoInfo}>
          <Text style={styles.authorName}>@{item.author}</Text>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.videoDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          {/* Hashtags */}
          <View style={styles.hashtagContainer}>
            <Text style={styles.hashtag}>#{item.category.toLowerCase()}</Text>
            <Text style={styles.hashtag}>#fintech</Text>
            <Text style={styles.hashtag}>#education</Text>
          </View>

          {/* Music/Audio info */}
          <View style={styles.audioInfo}>
            <Text style={styles.audioIcon}>🎵</Text>
            <Text style={styles.audioText}>Original audio - {item.author}</Text>
          </View>
        </View>
      </View>

      {/* Right side actions */}
      <View style={styles.rightActions}>
        {/* Profile */}
        <Pressable style={styles.actionButton}>
          <View style={styles.profileButton}>
            <Text style={styles.profileIcon}>👤</Text>
          </View>
          {!item.isFollowed && <View style={styles.followBadge} />}
        </Pressable>

        {/* Like */}
        <Pressable 
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Text style={[styles.actionIcon, item.isLiked && styles.likedIcon]}>
            {item.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.actionCount}>{item.likes}</Text>
        </Pressable>

        {/* Comment */}
        <Pressable 
          style={styles.actionButton}
          onPress={() => handleComment(item)}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{item.comments}</Text>
        </Pressable>

        {/* Share */}
        <Pressable 
          style={styles.actionButton}
          onPress={() => handleShare(item)}
        >
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionCount}>{item.shares}</Text>
        </Pressable>

        {/* More options */}
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionIcon}>⋯</Text>
        </Pressable>
      </View>

      {/* Bottom progress indicator */}
      <View style={styles.progressContainer}>
        {videoData.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i === index && styles.progressDotActive
            ]}
          />
        ))}
      </View>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && videoData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load videos</Text>
          <Pressable style={styles.retryButton} onPress={fetchVideos}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FinShort</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton}>
            <Text style={styles.headerIcon}>🔍</Text>
          </Pressable>
          <Pressable style={styles.headerButton}>
            <Text style={styles.headerIcon}>⋯</Text>
          </Pressable>
        </View>
      </View>

      {/* Video Feed */}
      <FlatList
        ref={flatListRef}
        data={videoData}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={VIDEO_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: VIDEO_HEIGHT,
          offset: VIDEO_HEIGHT * index,
          index,
        })}
        onRefresh={fetchVideos}
        refreshing={loading}
        style={styles.videoFeed}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
    fontFamily: Fonts?.poppinsMedium || 'System',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Fonts?.poppinsMedium || 'System',
  },
  retryButton: {
    backgroundColor: '#ff0050',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts?.poppinsSemiBold || 'System',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: Fonts?.poppinsBold || 'System',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
    padding: 8,
  },
  headerIcon: {
    fontSize: 18,
    color: '#fff',
  },
  videoFeed: {
    flex: 1,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
    position: 'relative',
  },
  videoBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  thumbnail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: Fonts?.poppinsBold || 'System',
  },
  playButton: {
    marginTop: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: '#000',
    marginLeft: 4,
  },
  durationOverlay: {
    position: 'absolute',
    top: 70,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: Fonts?.poppinsRegular || 'System',
  },
  leftContent: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 80,
  },
  videoInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    fontFamily: Fonts?.poppinsSemiBold || 'System',
  },
  videoTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: Fonts?.poppinsMedium || 'System',
  },
  videoDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    lineHeight: 18,
    fontFamily: Fonts?.poppinsRegular || 'System',
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  hashtag: {
    fontSize: 14,
    color: '#fff',
    marginRight: 8,
    fontWeight: '600',
    fontFamily: Fonts?.poppinsMedium || 'System',
  },
  audioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  audioText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: Fonts?.poppinsRegular || 'System',
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileIcon: {
    fontSize: 20,
  },
  followBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff0050',
    position: 'absolute',
    bottom: -2,
    alignSelf: 'center',
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  likedIcon: {
    color: '#ff0050',
  },
  actionCount: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    fontFamily: Fonts?.poppinsRegular || 'System',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    flexDirection: 'row',
  },
  progressDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: 4,
  },
  progressDotActive: {
    backgroundColor: '#fff',
  },
});

export default FinShort;