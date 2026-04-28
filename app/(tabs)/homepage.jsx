import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ImageBackground,
  PanResponder,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@apollo/client/react";
import { SWIPE, SWIPE_FEED } from "../../scripts/graphql";
import Navigation from "./navigation";
import styles from "../../style";

const { width } = Dimensions.get("window");
const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900";

const getCardProfile = (user) => ({
  id: user?.id,
  name: user?.username ?? "User",
  age: user?.profile?.age ?? "?",
  city: user?.profile?.city ?? "Unknown city",
  bio: user?.profile?.bio ?? "This user has not added a bio yet.",
  tags: user?.profile?.interests?.length ? user.profile.interests : ["New here"],
  image: {
    uri: user?.profile?.photos?.[0] || FALLBACK_PHOTO,
  },
});

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("home");
  const [index, setIndex] = useState(0);

  const position = useRef(new Animated.ValueXY()).current;
  const nextCardScale = useRef(new Animated.Value(0.93)).current;
  const isSwiping = useRef(false);

  const { data, loading, error, refetch } = useQuery(SWIPE_FEED, {
    variables: { limit: 20 },
  });
  const [doSwipe] = useMutation(SWIPE);

  const users = data?.swipeFeed ?? [];
  const currentUser = users[index];
  const nextUser = users[index + 1];
  const currentProfile = currentUser ? getCardProfile(currentUser) : null;
  const nextProfile = getCardProfile(nextUser ?? currentUser);

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ["-12deg", "0deg", "12deg"],
    extrapolate: "clamp",
  });

  const likeAnim = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeAnim = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const resetCard = () => {
    Animated.parallel([
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
        tension: 40,
        friction: 7,
      }),
      Animated.spring(nextCardScale, {
        toValue: 0.93,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const swipeCard = (direction) => {
    if (isSwiping.current || !currentUser) {
      return;
    }

    isSwiping.current = true;

    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: direction * width * 1.3, y: 0 },
        duration: 280,
        useNativeDriver: false,
      }),
      Animated.spring(nextCardScale, {
        toValue: 1,
        useNativeDriver: false,
      }),
    ]).start(() => {
      void doSwipe({
        variables: {
          toUserId: currentUser.id,
          direction: direction > 0 ? "RIGHT" : "LEFT",
        },
      }).catch(() => {});

      setIndex((prev) => prev + 1);

      requestAnimationFrame(() => {
        position.setValue({ x: 0, y: 0 });
        nextCardScale.setValue(0.93);
        isSwiping.current = false;
      });
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        !isSwiping.current &&
        (Math.abs(gesture.dx) > 8 || Math.abs(gesture.dy) > 8),

      onPanResponderMove: (_, gesture) => {
        if (isSwiping.current) {
          return;
        }

        position.setValue({ x: gesture.dx, y: gesture.dy });
        nextCardScale.setValue(0.93 + Math.min(Math.abs(gesture.dx) / width, 0.07));
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 110) {
          swipeCard(1);
        } else if (gesture.dx < -110) {
          swipeCard(-1);
        } else {
          resetCard();
        }
      },
    })
  ).current;

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#FF4D6D" />
      </View>
    );
  }

  if (error || !currentProfile) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
        </View>
        <View style={[styles.cardStack, { justifyContent: "center" }]}>
          <Text style={styles.emptyStateTitle}>No more profiles</Text>
          <Text style={styles.emptyStateText}>
            {error
              ? "We could not load registered users right now."
              : "No registered users are available for your swipe feed yet."}
          </Text>
          <Pressable
            style={styles.refreshProfilesButton}
            onPress={() => {
              setIndex(0);
              refetch();
            }}
          >
            <Text style={styles.refreshProfilesButtonText}>Refresh</Text>
          </Pressable>
        </View>
        <Navigation activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Discover</Text>
        </View>
        <Pressable style={styles.filterButton}>
          <Ionicons name="options-outline" size={22} color="#FF4D6D" />
        </Pressable>
      </View>

      <View style={styles.cardStack}>
        <Animated.View
          style={[styles.card, styles.backCard, { transform: [{ scale: nextCardScale }] }]}
        >
          <ImageBackground
            source={nextProfile.image}
            resizeMode="cover"
            style={styles.cardImage}
            imageStyle={styles.cardImageRadius}
          >
            <View style={styles.cardGradient} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>
                {nextProfile.name}, {nextProfile.age}
              </Text>
              <Text style={styles.cardLocation}>
                <Ionicons name="location-sharp" size={13} color="#fff" /> {nextProfile.city}
              </Text>
            </View>
          </ImageBackground>
        </Animated.View>

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            styles.frontCard,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate },
              ],
            },
          ]}
        >
          <ImageBackground
            source={currentProfile.image}
            resizeMode="cover"
            style={styles.cardImage}
            imageStyle={styles.cardImageRadius}
          >
            <View style={styles.cardGradient} />

            <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeAnim }]}>
              <Text style={styles.likeStampText}>LIKE</Text>
            </Animated.View>

            <Animated.View style={[styles.stamp, styles.nopeStamp, { opacity: nopeAnim }]}>
              <Text style={styles.nopeStampText}>NOPE</Text>
            </Animated.View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>
                {currentProfile.name}, {currentProfile.age}
              </Text>
              <Text style={styles.cardLocation}>
                <Ionicons name="location-sharp" size={13} color="#fff" /> {currentProfile.city}
              </Text>
              <Text style={styles.cardBio}>{currentProfile.bio}</Text>
              <View style={styles.tagsRow}>
                {currentProfile.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
      </View>

      <Navigation activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}
