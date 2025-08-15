      // Transform data
  //     const transformedData = data.map((video, index) => ({
  //       id: video.id || index + 1,
  //       title: video.title || "Untitled Video",
  //       description: video.description || "Financial education content",
  //       duration: video.duration || "0:00",
  //       views: video.views || "0",
  //       likes: video.likes || "0",
  //       comments: video.comments || "0",
  //       shares: video.shares || "0",
  //       thumbnail:
  //         video.thumbnail ||
  //         `https://via.placeholder.com/400x700/87CEEB/FFFFFF?text=${
  //           video.category || "Video"
  //         }`,
  //       videoUrl: video.videoUrl || video.url || "",
  //       category: video.category || "General",
  //       author: video.author || "FinShort",
  //       isLiked: false,
  //       isFollowed: false
  //     }));

  //     setVideoData(transformedData);
  //   } catch (err) {
  //     console.error("Error fetching videos:", err);
  //     setError(err.message);
  //     Alert.alert(
  //       "Error",
  //       "Failed to load videos. Please check your internet connection and try again.",
  //       [
  //         { text: "Retry", onPress: () => fetchVideos() },
  //         { text: "Cancel", style: "cancel" }
  //       ]
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // React.useEffect(() => {
  //   fetchVideos();
  // }, []);

  // const handleLike = (videoId) => {
  //   setVideoData((prevData) =>
  //     prevData.map((video) =>
  //       video.id === videoId
  //         ? {
  //             ...video,
  //             isLiked: !video.isLiked,
  //             likes: video.isLiked
  //               ? (
  //                   parseInt(
  //                     video.likes.toString().replace("K", "000").replace("M", "000000")
  //                   ) - 1
  //                 ).toString()
  //               : (
  //                   parseInt(
  //                     video.likes.toString().replace("K", "000").replace("M", "000000")
  //                   ) + 1
  //                 ).toString()
  //           }
  //         : video
  //     )
  //   );
  // };

  // const handleFollow = (videoId) => {
  //   setVideoData((prevData) =>
  //     prevData.map((video) =>
  //       video.id === videoId
  //         ? { ...video, isFollowed: !video.isFollowed }
  //         : video
  //     )
  //   );
  // };

  // const handleShare = (video) => {
  //   console.log("Share video:", video.title);
  // };

  // const handleComment = (video) => {
  //   console.log("Open comments for:", video.title);
  // };

  // const onViewableItemsChanged = React.useCallback(({ viewableItems }) => {
  //   if (viewableItems.length > 0) {
  //     setCurrentVideoIndex(viewableItems[0].index);
  //   }
  // }, []);

  // const viewabilityConfig = {
  //   itemVisiblePercentThreshold: 50
  // };

  // const renderVideoItem = ({ item, index }) => (
  //   <View style={styles.videoContainer}>
  //     {/* Video Background */}
  //     <View style={styles.videoBackground}>
  //       <View
  //         style={[
  //           styles.thumbnail,
  //           { backgroundColor: Color.colorDeepskyblue || "#00BFFF" }
  //         ]}
  //       >
  //         <Text style={styles.categoryText}>{item.category}</Text>
  //         <View style={styles.playButton}>
  //           <Text style={styles.playIcon}>▶</Text>
  //         </View>
  //       </View>

  //       {/* Video duration overlay */}
  //       <View style={styles.durationOverlay}>
  //         <Text style={styles.durationText}>{item.duration}</Text>
  //       </View>
  //     </View>

  //     {/* Left content */}
  //     <View style={styles.leftContent}>
  //       <View style={styles.videoInfo}>
  //         <Text style={styles.authorName}>@{item.author}</Text>
  //         <Text style={styles.videoTitle} numberOfLines={2}>
  //           {item.title}
  //         </Text>
  //         <Text style={styles.videoDescription} numberOfLines={2}>
  //           {item.description}
  //         </Text>

  //         {/* Hashtags */}
  //         <View style={styles.hashtagContainer}>
  //           <Text style={styles.hashtag}>#{item.category.toLowerCase()}</Text>
  //           <Text style={styles.hashtag}>#fintech</Text>
  //           <Text style={styles.hashtag}>#education</Text>
  //         </View>

  //         {/* Audio info */}
  //         <View style={styles.audioInfo}>
  //           <Text style={styles.audioIcon}>🎵</Text>
  //           <Text style={styles.audioText}>Original audio - {item.author}</Text>
  //         </View>
  //       </View>
  //     </View>

  //     {/* Right actions */}
  //     <View style={styles.rightActions}>
  //       {/* Profile */}
  //       <Pressable style={styles.actionButton} onPress={() => handleFollow(item.id)}>
  //         <View style={styles.profileButton}>
  //           <Text style={styles.profileIcon}>👤</Text>
  //         </View>
  //         {!item.isFollowed && <View style={styles.followBadge} />}
  //       </Pressable>

  //       {/* Like */}
  //       <Pressable style={styles.actionButton} onPress={() => handleLike(item.id)}>
  //         <Text style={[styles.actionIcon, item.isLiked && styles.likedIcon]}>
  //           {item.isLiked ? "❤️" : "🤍"}
  //         </Text>
  //         <Text style={styles.actionCount}>{item.likes}</Text>
  //       </Pressable>

  //       {/* Comment */}
  //       <Pressable style={styles.actionButton} onPress={() => handleComment(item)}>
  //         <Text style={styles.actionIcon}>💬</Text>
  //         <Text style={styles.actionCount}>{item.comments}</Text>
  //       </Pressable>

  //       {/* Share */}
  //       <Pressable style={styles.actionButton} onPress={() => handleShare(item)}>
  //         <Text style={styles.actionIcon}>📤</Text>
  //         <Text style={styles.actionCount}>{item.shares}</Text>
  //       </Pressable>

  //       {/* More options */}
  //       <Pressable style={styles.actionButton}>
  //         <Text style={styles.actionIcon}>⋯</Text>
  //       </Pressable>
  //     </View>

  //     {/* Progress dots */}
  //     <View style={styles.progressContainer}>
  //       {videoData.map((_, i) => (
  //         <View
  //           key={i}
  //           style={[
  //             styles.progressDot,
  //             i === index && styles.progressDotActive
  //           ]}
  //         />
  //       ))}
  //     </View>
  //   </View>
  // );