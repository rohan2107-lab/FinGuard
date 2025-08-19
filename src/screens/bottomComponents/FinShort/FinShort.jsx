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
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Video from "react-native-video";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Make sure you have this library installed

import { Color, Fonts } from "../../../constants/GlobleStyle";
import { appAxios } from "../../../api/apiconfig";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const VIDEO_HEIGHT = SCREEN_HEIGHT;

const FinShort = () => {
  const [videoData, setVideoData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);
  const [videoPausedStates, setVideoPausedStates] = React.useState({});
  const flatListRef = React.useRef(null);
  const videoRefs = React.useRef({});

  console.log("FinShort component rendered");

  // Fixed fetch function with proper error handling and auth token
  const fetchVideos = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Get auth token from AsyncStorage
      const token = await AsyncStorage.getItem("authToken");

      // Handle case where token is not found
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      // Step 2: Configure headers to include the token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await appAxios.get("/api/videos", { headers });

      console.log("Full API Response:", response.data);

      const apiData = response.data;
      if (!apiData?.success) {
        throw new Error(apiData?.message || "API returned unsuccessful response");
      }

      const videos = apiData.data?.videos || [];
      console.log("Fetched videos:", videos);

      if (!Array.isArray(videos)) {
        throw new Error("Videos data is not in expected format");
      }

      if (videos.length === 0) {
        console.log("No videos found");
        setVideoData([]);
        return;
      }

      const transformedData = videos.map((video, index) => {
        const formatDuration = (seconds) => {
          if (!seconds || isNaN(seconds)) return "0:00";
          const mins = Math.floor(seconds / 60);
          const secs = Math.floor(seconds % 60);
          return `${mins}:${secs.toString().padStart(2, "0")}`;
        };

        const category = video.tags && video.tags.length > 0 ? video.tags[0] : "General";

        const authorName =
          video.uploadedBy?.fullName ||
          video.uploadedBy?.username ||
          video.uploadedBy?.email?.split("@")[0] ||
          "Unknown";

        const formatCount = (count) => {
          const num = parseInt(count) || 0;
          if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
          if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
          return num.toString();
        };

        return {
          id: video._id || `video_${index}`,
          title: video.title || "Untitled Video",
          description: video.description || "Financial education content",
          duration: formatDuration(video.duration),
          views: formatCount(video.views),
          likes: formatCount(video.likes || 0),
          comments: formatCount(video.comments || 0),
          shares: formatCount(video.shares || 0),
          thumbnail:
            video.thumbnailUrl ||
            video.cloudinaryUrl ||
            `https://via.placeholder.com/400x700/87CEEB/FFFFFF?text=${encodeURIComponent(
              category
            )}`,
          videoUrl: video.videoUrl || video.cloudinaryUrl || "",
          category: category,
          author: authorName,
          cloudinaryId: video.cloudinaryId,
          format: video.format,
          size: video.size,
          isPublic: video.isPublic,
          createdAt: video.createdAt,
          updatedAt: video.updatedAt,
          tags: video.tags || [],
          isLiked: video.isLiked || false,
          isFollowed: video.isFollowed || false,
        };
      });

      const validVideos = transformedData.filter(
        (video) => video.videoUrl && video.videoUrl.trim() !== ""
      );

      setVideoData(validVideos);
    } catch (err) {
      console.error("Error fetching videos:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to load videos";
      setError(errorMessage);

      if (err.response && err.response.status === 401) {
        Alert.alert(
          "Session Expired",
          "Your session has expired. Please log in again.",
          [{ text: "OK", onPress: () => { /* Add logic to redirect to login page */ } }]
        );
      } else {
        Alert.alert(
          "Error",
          `${errorMessage}. Please check your internet connection and try again.`,
          [
            { text: "Retry", onPress: () => fetchVideos(page, limit) },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Call fetchVideos when component mounts
  React.useEffect(() => {
    fetchVideos();
  }, []);

  // Handle like with optimistic updates and error handling
  const handleLike = async (videoId) => {
    try {
      // Optimistic update
      setVideoData((prevData) =>
        prevData.map((video) => {
          if (video.id === videoId) {
            const currentLikes = parseInt(video.likes.toString().replace(/[KM]/g, "")) || 0;
            const newLikes = video.isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
            const formatCount = (count) => {
              if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
              if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
              return count.toString();
            };

            return {
              ...video,
              isLiked: !video.isLiked,
              likes: formatCount(newLikes),
            };
          }
          return video;
        })
      );

      // TODO: Make API call to backend to update like status
      // const token = await AsyncStorage.getItem('authToken');
      // await appAxios.post(`/api/videos/${videoId}/like`, {}, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
    } catch (err) {
      console.error("Error updating like:", err);
      // Revert optimistic update on error
      // You could implement a revert mechanism here
    }
  };

  const handleShare = (video) => {
    console.log("Share video:", video.title);
    Alert.alert("Share", `Sharing: ${video.title}`);
  };

  const onViewableItemsChanged = React.useCallback(
    ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index;
        if (newIndex !== null && newIndex !== currentVideoIndex) {
          setCurrentVideoIndex(newIndex);

          setVideoPausedStates((prev) => {
            const newStates = {};
            Object.keys(prev).forEach((key) => {
              newStates[parseInt(key)] = parseInt(key) !== newIndex;
            });
            newStates[newIndex] = false;
            return newStates;
          });
        }
      }
    },
    [currentVideoIndex]
  );

  const handleVideoPress = () => {
    setVideoPausedStates((prev) => ({
      ...prev,
      [currentVideoIndex]: !prev[currentVideoIndex],
    }));
  };

  const viewabilityConfig = React.useMemo(
    () => ({
      itemVisiblePercentThreshold: 50,
      minimumViewTime: 100,
    }),
    []
  );

  const renderVideoItem = React.useCallback(
    ({ item, index }) => {
      const isCurrentVideo = index === currentVideoIndex;
      const isPaused = videoPausedStates[index] ?? index !== 0;

      return (
        <View style={styles.videoContainer}>
          <Pressable style={styles.videoBackground} onPress={handleVideoPress}>
            {item.videoUrl ? (
              <Video
                ref={(ref) => {
                  videoRefs.current[index] = ref;
                }}
                source={{ uri: item.videoUrl }}
                style={styles.video}
                paused={isPaused}
                repeat={true}
                resizeMode="cover"
                muted={false}
                volume={isCurrentVideo ? 1.0 : 0.0}
                onLoad={(data) => {
                  console.log(`Video ${index} loaded:`, data);
                }}
                onError={(error) => {
                  console.error(`Video ${index} error:`, error);
                }}
                onBuffer={() => {
                  console.log(`Video ${index} buffering...`);
                }}
                onProgress={(data) => {}}
              />
            ) : (
              <View style={[styles.video, styles.placeholderVideo]}>
                <Text style={styles.placeholderText}>Video not available</Text>
              </View>
            )}

            {isPaused && isCurrentVideo && (
              <View style={styles.playOverlay}>
                <View style={styles.playButton}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              </View>
            )}
          </Pressable>

          <View style={styles.leftContent}>
            <View style={styles.videoInfo}>
              <Text style={styles.authorName}>@{item.author}</Text>
              <Text style={styles.videoTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
          </View>

          {videoData.length > 1 && (
            <View style={styles.progressContainer}>
              {videoData.slice(0, 5).map((_, i) => (
                <View
                  key={i}
                  style={[styles.progressDot, i === index && styles.progressDotActive]}
                />
              ))}
              {videoData.length > 5 && <Text style={styles.moreIndicator}>...</Text>}
            </View>
          )}
        </View>
      );
    },
    [currentVideoIndex, videoPausedStates, videoData.length]
  );

  React.useEffect(() => {
    return () => {
      Object.values(videoRefs.current).forEach((ref) => {
        if (ref && typeof ref.dismissFullscreenPlayer === "function") {
          ref.dismissFullscreenPlayer();
        }
      });
    };
  }, []);

  if (loading && videoData.length === 0) {
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

  if (error && videoData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load videos</Text>
          <Text style={styles.errorSubText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => fetchVideos()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!loading && videoData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No videos available</Text>
          <Text style={styles.errorSubText}>Check back later for new content</Text>
          <Pressable style={styles.retryButton} onPress={() => fetchVideos()}>
            <Text style={styles.retryButtonText}>Refresh</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <FlatList
        ref={flatListRef}
        data={videoData}
        renderItem={renderVideoItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
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
        onRefresh={() => fetchVideos()}
        refreshing={loading}
        style={styles.videoFeed}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
    fontFamily: Fonts?.poppinsMedium || "System",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: Fonts?.poppinsMedium || "System",
  },
  errorSubText: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: Fonts?.poppinsRegular || "System",
  },
  retryButton: {
    backgroundColor: "#ff0050",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Fonts?.poppinsSemiBold || "System",
  },
  videoFeed: {
    flex: 1,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
    position: "relative",
  },
  videoBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  placeholderVideo: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Fonts?.poppinsRegular || "System",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    fontSize: 24,
    color: "#000",
    marginLeft: 4,
  },
  leftContent: {
    position: "absolute",
    bottom: 120,
    left: 16,
    right: 80,
  },
  videoInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    fontFamily: Fonts?.poppinsSemiBold || "System",
  },
  videoTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: Fonts?.poppinsMedium || "System",
  },
  videoDescription: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
    lineHeight: 18,
    fontFamily: Fonts?.poppinsRegular || "System",
  },
  progressContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  progressDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginRight: 4,
  },
  progressDotActive: {
    backgroundColor: "#fff",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moreIndicator: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginLeft: 4,
    fontFamily: Fonts?.poppinsRegular || "System",
  },
});

export default FinShort;