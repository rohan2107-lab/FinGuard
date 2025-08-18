import * as React from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, TextInput, Alert, PermissionsAndroid, Platform, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const BranchLocator = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = React.useState('');
    const [currentLocation, setCurrentLocation] = React.useState(null);
    const [nearbyPlaces, setNearbyPlaces] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState('bank');
    const [loading, setLoading] = React.useState(false);

    // Your GoMaps API Key - Remember to restrict this key for security
    const GOMAPS_API_KEY = 'AlzaSyzVf95eUwRBqBC67Z_neG3b8ZEgbEaHPgB';

    // GoMaps API Base URL - Update this according to your GoMaps provider
    const GOMAPS_BASE_URL = 'https://maps.gomaps.pro/maps/api'; // Update this URL

    // Initial region (no default location)
    const [region, setRegion] = React.useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const categories = [
        { id: 'bank', title: "Banks", icon: "🏦", type: 'bank' },
        { id: 'atm', title: "ATMs", icon: "🏧", type: 'atm' },
        { id: 'police', title: "Police", icon: "👮", type: 'police' },
        { id: 'hospital', title: "Hospitals", icon: "🏥", type: 'hospital' }
    ];

    React.useEffect(() => {
        // Only request location permission, don't fetch places automatically
        requestLocationPermission();
    }, []);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            // For iOS in React Native, we'll use the built-in geolocation
            getCurrentLocation();
            return;
        }

        // For Android, check if we need permissions
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location to find nearby places.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Location permission granted');
                    getCurrentLocation();
                } else {
                    console.log('Location permission denied');
                    Alert.alert(
                        'Permission Required', 
                        'Location permission is required to find nearby places. You can enable it in settings or use the search feature.',
                        [
                            { 
                                text: 'Settings', 
                                onPress: () => Linking.openSettings() 
                            },
                            { 
                                text: 'OK', 
                                onPress: () => {} // Just close the dialog
                            }
                        ]
                    );
                }
            } catch (err) {
                console.warn('Permission error:', err);
                Alert.alert('Error', 'Unable to request location permission. Using default location.');
                fetchNearbyPlaces(region.latitude, region.longitude, selectedCategory);
            }
        } else {
            // For web or other platforms, directly try to get location
            getCurrentLocation();
        }
    };

    const getCurrentLocation = () => {
        setLoading(true);
        
        // Check if geolocation is available
        if (!navigator.geolocation) {
            setLoading(false);
            // Alert.alert(
            //     'Geolocation Not Supported',
            //     'Your device does not support location services. Using default location.',
            //     [
            //         { 
            //             text: 'OK', 
            //             onPress: () => fetchNearbyPlaces(region.latitude, region.longitude, selectedCategory) 
            //         }
            //     ]
            // );
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 60000
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                console.log('Got current location:', latitude, longitude, 'accuracy:', accuracy);
                
                const newLocation = { latitude, longitude };
                setCurrentLocation(newLocation);
                
                const newRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                setRegion(newRegion);
                
                setLoading(false);
                
                // Show success message with accuracy
                Alert.alert(
                    'Location Found!',
                    `Location updated with ${Math.round(accuracy)}m accuracy`,
                    [
                        { text: 'OK', onPress: () => fetchNearbyPlaces(latitude, longitude, selectedCategory) }
                    ]
                );
            },
            (error) => {
                console.log('Geolocation error:', error.code, error.message);
                setLoading(false);
                
                let errorMessage = 'Unable to get your location. ';
                let buttons = [];
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location access denied. Please enable location services in your browser settings.';
                        buttons = [
                            { text: 'Retry', onPress: () => getCurrentLocation() },
                            { text: 'Use Default', onPress: () => fetchNearbyPlaces(region.latitude, region.longitude, selectedCategory) }
                        ];
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        buttons = [
                            { text: 'Use Default', onPress: () => {} }
                        ];
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        buttons = [
                            { text: 'Retry', onPress: () => getCurrentLocation() },
                            { text: 'Use Default', onPress: () => fetchNearbyPlaces(region.latitude, region.longitude, selectedCategory) }
                        ];
                        break;
                    default:
                        errorMessage += 'Unknown location error.';
                        buttons = [
                            { text: 'Use Default', onPress: () => {} }
                        ];
                }
                
                Alert.alert('Location Error', errorMessage, buttons);
            },
            options
        );
    };

    const fetchNearbyPlaces = async (latitude, longitude, type) => {
        setLoading(true);
        console.log(`Fetching ${type} near ${latitude}, ${longitude}`);
        
        try {
            const radius = 5000; // 5km radius
            let searchType = type;
            
            // Map our categories to GoMaps API types (similar to Google Places)
            if (type === 'atm') searchType = 'atm';
            else if (type === 'police') searchType = 'police';
            else if (type === 'hospital') searchType = 'hospital';
            else searchType = 'bank';

            // GoMaps API URL for nearby search
            const url = `${GOMAPS_BASE_URL}/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${searchType}&key=${GOMAPS_API_KEY}`;
            
            console.log('GoMaps API URL:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    // Add any additional headers required by GoMaps
                    'User-Agent': 'YourAppName/1.0',
                },
            });
            
            const data = await response.json();
            console.log('GoMaps API Response:', data);
            
            // Handle GoMaps response format (might be similar to Google Maps)
            if (data.status === 'OK' && data.results) {
                const places = data.results.slice(0, 20).map((place, index) => ({
                    id: place.place_id || place.id || `place_${index}`,
                    name: place.name || 'Unknown Place',
                    address: place.vicinity || place.formatted_address || place.address || 'Address not available',
                    latitude: place.geometry?.location?.lat || place.lat || place.latitude,
                    longitude: place.geometry?.location?.lng || place.lng || place.longitude,
                    rating: place.rating || null,
                    isOpen: place.opening_hours?.open_now ?? place.is_open,
                    type: place.types?.[0] || place.type || searchType,
                    distance: calculateDistance(
                        latitude, 
                        longitude, 
                        place.geometry?.location?.lat || place.lat || place.latitude, 
                        place.geometry?.location?.lng || place.lng || place.longitude
                    )
                }));
                
                console.log('Processed places:', places.length);
                setNearbyPlaces(places);
                
                if (places.length === 0) {
                    Alert.alert('No Results', `No ${categories.find(c => c.id === type)?.title.toLowerCase()} found in this area`);
                }
            } else if (data.status === 'ZERO_RESULTS') {
                setNearbyPlaces([]);
                Alert.alert('No Results', `No ${categories.find(c => c.id === type)?.title.toLowerCase()} found in this area`);
            } else if (data.status === 'REQUEST_DENIED' || data.error) {
                console.error('GoMaps API Key Error:', data.error_message || data.error);
                Alert.alert('API Error', 'Please check your GoMaps API key configuration');
                // Load some dummy data for testing
                loadDummyData(type);
            } else {
                console.error('GoMaps API Error:', data.status, data.error_message);
                Alert.alert('Error', data.error_message || 'Unable to fetch nearby places');
                // Load some dummy data for testing
                loadDummyData(type);
            }
        } catch (error) {
            console.error('Network error:', error);
            Alert.alert('Network Error', 'Please check your internet connection and GoMaps API configuration');
            // Load some dummy data for testing
            loadDummyData(type);
        } finally {
            setLoading(false);
        }
    };

    // Load dummy data for testing when API is not working
    const loadDummyData = (type) => {
        // Only show dummy data if we have a valid location
        if (region.latitude === 0 && region.longitude === 0) {
            setNearbyPlaces([]);
            return;
        }
        
        const dummyData = {
            bank: [
                { id: 'bank1', name: 'Local Bank', address: 'Near your location', latitude: region.latitude + 0.001, longitude: region.longitude + 0.001, distance: '0.5', rating: 4.2, isOpen: true },
                { id: 'bank2', name: 'Community Bank', address: 'Nearby area', latitude: region.latitude + 0.002, longitude: region.longitude + 0.002, distance: '1.2', rating: 4.0, isOpen: true },
                { id: 'bank3', name: 'National Bank', address: 'Local branch', latitude: region.latitude - 0.001, longitude: region.longitude - 0.001, distance: '1.8', rating: 3.8, isOpen: false },
            ],
            atm: [
                { id: 'atm1', name: 'Bank ATM', address: 'Near your location', latitude: region.latitude + 0.001, longitude: region.longitude + 0.001, distance: '0.3', rating: null, isOpen: true },
                { id: 'atm2', name: 'Community ATM', address: 'Nearby area', latitude: region.latitude + 0.002, longitude: region.longitude + 0.002, distance: '0.9', rating: null, isOpen: true },
                { id: 'atm3', name: 'Local ATM', address: 'Local area', latitude: region.latitude - 0.001, longitude: region.longitude - 0.001, distance: '1.5', rating: null, isOpen: true },
            ],
            police: [
                { id: 'police1', name: 'Local Police Station', address: 'Near your location', latitude: region.latitude + 0.001, longitude: region.longitude + 0.001, distance: '0.7', rating: null, isOpen: true },
                { id: 'police2', name: 'Community Police Post', address: 'Local area', latitude: region.latitude - 0.001, longitude: region.longitude - 0.001, distance: '2.1', rating: null, isOpen: true },
            ],
            hospital: [
                { id: 'hospital1', name: 'Community Hospital', address: 'Near your location', latitude: region.latitude + 0.001, longitude: region.longitude + 0.001, distance: '1.2', rating: 4.1, isOpen: true },
                { id: 'hospital2', name: 'Local Clinic', address: 'Local area', latitude: region.latitude - 0.001, longitude: region.longitude - 0.001, distance: '2.5', rating: 3.9, isOpen: true },
            ]
        };
        
        setNearbyPlaces(dummyData[type] || []);
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return distance.toFixed(1);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category.id);
        // Only fetch places if we have a valid location (not default 0,0)
        if (currentLocation && currentLocation.latitude !== 0 && currentLocation.longitude !== 0) {
            fetchNearbyPlaces(currentLocation.latitude, currentLocation.longitude, category.id);
        } else if (region.latitude !== 0 && region.longitude !== 0) {
            fetchNearbyPlaces(region.latitude, region.longitude, category.id);
        } else {
            Alert.alert('Location Required', 'Please search for a location or allow location access to find nearby places.');
        }
    };

    const searchLocation = async (query) => {
        if (!query.trim()) {
            Alert.alert('Invalid Search', 'Please enter a location to search');
            return;
        }
        
        setLoading(true);
        try {
            // GoMaps Geocoding API
            const url = `${GOMAPS_BASE_URL}/geocode/json?address=${encodeURIComponent(query)}&key=${GOMAPS_API_KEY}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'YourAppName/1.0',
                },
            });
            const data = await response.json();
            
            if (data.status === 'OK' && data.results && data.results.length > 0) {
                const location = data.results[0].geometry?.location || data.results[0];
                const lat = location.lat || location.latitude;
                const lng = location.lng || location.longitude;
                
                const newRegion = {
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                };
                setRegion(newRegion);
                setCurrentLocation({ latitude: lat, longitude: lng });
                
                // Clear search text after successful search
                setSearchText('');
                
                // Show success message
                Alert.alert(
                    'Location Found!',
                    `Found: ${data.results[0].formatted_address || query}`,
                    [
                        { text: 'OK', onPress: () => fetchNearbyPlaces(lat, lng, selectedCategory) }
                    ]
                );
            } else {
                Alert.alert('Location Not Found', 'Please try a different search term or check your spelling');
            }
        } catch (error) {
            console.error('Error searching location:', error);
            Alert.alert('Search Error', 'Unable to search location. Please check your internet connection and GoMaps configuration.');
        } finally {
            setLoading(false);
        }
    };

    const openDirections = (place) => {
        const url = Platform.select({
            ios: `maps://app?daddr=${place.latitude},${place.longitude}`,
            android: `google.navigation:q=${place.latitude},${place.longitude}`,
        });
        
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                // Fallback to web browser - you might want to use GoMaps URL here
                const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
                Linking.openURL(webUrl);
            }
        }).catch(err => {
            console.error('Error opening directions:', err);
            Alert.alert('Error', 'Unable to open directions');
        });
    };

    // Remove unused commented code and styles

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Location Finder</Text>
                <View style={styles.headerSpacer}></View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Search Section */}
                <View style={styles.searchSection}>
                    <View style={styles.searchContainer}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search location"
                            placeholderTextColor="#666"
                            value={searchText}
                            onChangeText={setSearchText}
                            onSubmitEditing={() => searchLocation(searchText)}
                        />
                        <Pressable 
                            style={[
                                styles.searchButton,
                                loading && styles.searchButtonDisabled
                            ]} 
                            onPress={() => searchLocation(searchText)}
                            disabled={loading || !searchText.trim()}
                        >
                            <Text style={styles.searchButtonText}>
                                {loading ? '⏳' : '🔍'}
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Category Selection */}
                <View style={styles.categorySection}>
                    <Text style={styles.sectionTitle}>Find Nearby</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                        {categories.map((category) => (
                            <Pressable 
                                key={category.id} 
                                style={[
                                    styles.categoryCard,
                                    selectedCategory === category.id && styles.selectedCategory
                                ]}
                                onPress={() => handleCategorySelect(category)}
                            >
                                <Text style={styles.categoryIcon}>{category.icon}</Text>
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory === category.id && styles.selectedCategoryText
                                ]}>{category.title}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Places List */}
                <View style={styles.placesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Nearby {categories.find(c => c.id === selectedCategory)?.title} ({nearbyPlaces.length})
                        </Text>
                        {currentLocation && (
                            <View style={styles.locationIndicator}>
                                <Text style={styles.locationIndicatorText}>📍 Located</Text>
                            </View>
                        )}
                    </View>
                    <ScrollView style={styles.placesList} showsVerticalScrollIndicator={false}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <Text style={styles.loadingText}>Loading...</Text>
                                <Text style={styles.loadingSubtext}>Finding nearby places</Text>
                            </View>
                        ) : nearbyPlaces.length === 0 ? (
                            <View style={styles.noResultsContainer}>
                                <Text style={styles.noResultsText}>
                                    {region.latitude === 0 && region.longitude === 0 
                                        ? 'Search for a location to find nearby places'
                                        : `No ${categories.find(c => c.id === selectedCategory)?.title.toLowerCase()} found nearby`
                                    }
                                </Text>
                                <Text style={styles.noResultsSubtext}>
                                    {region.latitude === 0 && region.longitude === 0 
                                        ? 'Use the search bar above or allow location access'
                                        : 'Try searching for a different location'
                                    }
                                </Text>
                            </View>
                        ) : (
                            nearbyPlaces.map((place) => (
                                <View key={place.id} style={styles.placeCard}>
                                    <View style={styles.placeHeader}>
                                        <View style={styles.placeInfo}>
                                            <Text style={styles.placeName}>{place.name}</Text>
                                            <Text style={styles.placeDistance}>{place.distance} km away</Text>
                                        </View>
                                        {place.rating && (
                                            <View style={styles.ratingContainer}>
                                                <Text style={styles.rating}>⭐ {place.rating}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.placeAddress}>{place.address}</Text>
                                    <View style={styles.placeFooter}>
                                        <Text style={[
                                            styles.placeStatus,
                                            place.isOpen === true ? styles.openStatus : 
                                            place.isOpen === false ? styles.closedStatus : styles.unknownStatus
                                        ]}>
                                            {place.isOpen === true ? '🟢 Open' : 
                                             place.isOpen === false ? '🔴 Closed' : '⚪ Hours unknown'}
                                        </Text>
                                        <Pressable 
                                            style={styles.directionsButton}
                                            onPress={() => openDirections(place)}
                                        >
                                            <Text style={styles.directionsText}>Directions</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ))
                        )}
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
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        paddingHorizontal: 15,
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
    searchButton: {
        backgroundColor: "#d01f00",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginLeft: 10,
    },
    searchButtonDisabled: {
        backgroundColor: "#888888",
    },
    searchButtonText: {
        fontSize: 18,
        color: "#ffffff",
    },
    // Remove unused styles related to map and current location button
    /*
    currentLocationButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#d01f00",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 15,
        justifyContent: "center",
    },
    currentLocationButtonDisabled: {
        backgroundColor: "#888888",
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
    mapContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    map: {
        flex: 1,
    },
    mapPlaceholder: {
        backgroundColor: "#333333",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        padding: 20,
    },
    mapPlaceholderText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    mapPlaceholderSubtext: {
        color: "#cccccc",
        fontSize: 12,
        textAlign: "center",
        marginBottom: 4,
    },
    mapLocationIndicator: {
        backgroundColor: 'rgba(76, 175, 80, 0.9)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginTop: 10,
    },
    locationFoundText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    mockMapMarkers: {
        marginTop: 15,
        alignItems: 'center',
    },
    mockMarkerTitle: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    mockMarker: {
        color: '#e0e0e0',
        fontSize: 11,
        marginBottom: 3,
        textAlign: 'center',
    },
    */
    categorySection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#ffffff",
        marginBottom: 15,
    },
    categoriesScroll: {
        flexDirection: 'row',
    },
    categoryCard: {
        backgroundColor: "#e8f5e9",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: "center",
        marginRight: 12,
        minWidth: 80,
    },
    selectedCategory: {
        backgroundColor: "#d01f00",
    },
    categoryIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#000000",
        textAlign: "center",
    },
    selectedCategoryText: {
        color: "#ffffff",
    },
    mapContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    map: {
        flex: 1,
    },
    mapPlaceholder: {
        backgroundColor: "#333333",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        padding: 20,
    },
    mapPlaceholderText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    mapPlaceholderSubtext: {
        color: "#cccccc",
        fontSize: 12,
        textAlign: "center",
        marginBottom: 4,
    },
    mapLocationIndicator: {
        backgroundColor: 'rgba(76, 175, 80, 0.9)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginTop: 10,
    },
    locationFoundText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    mockMapMarkers: {
        marginTop: 15,
        alignItems: 'center',
    },
    mockMarkerTitle: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    mockMarker: {
        color: '#e0e0e0',
        fontSize: 11,
        marginBottom: 3,
        textAlign: 'center',
    },
    placesSection: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    locationIndicator: {
        backgroundColor: 'rgba(76, 175, 80, 0.9)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    locationIndicatorText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '600',
    },
    placesList: {
        flex: 1,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    loadingText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    loadingSubtext: {
        color: "#cccccc",
        fontSize: 14,
    },
    noResultsContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    noResultsText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 8,
    },
    noResultsSubtext: {
        color: "#cccccc",
        fontSize: 14,
        textAlign: "center",
    },
    placeCard: {
        backgroundColor: "#e8f5e9",
        borderRadius: 16,
        padding: 16,
        marginBottom: 15,
    },
    placeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    placeInfo: {
        flex: 1,
    },
    placeName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 4,
    },
    placeDistance: {
        fontSize: 14,
        color: "#d01f00",
        fontWeight: "500",
    },
    ratingContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: "#fff3e0",
    },
    rating: {
        fontSize: 12,
        fontWeight: "500",
        color: "#f57c00",
    },
    placeAddress: {
        fontSize: 14,
        color: "#666666",
        marginBottom: 12,
        lineHeight: 20,
    },
    placeFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    placeStatus: {
        fontSize: 12,
        fontWeight: "500",
    },
    openStatus: {
        color: "#2e7d32",
    },
    closedStatus: {
        color: "#d32f2f",
    },
    unknownStatus: {
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