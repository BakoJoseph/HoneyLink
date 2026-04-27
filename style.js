import { Platform, StatusBar, StyleSheet, ViewStyle } from "react-native";

import { INNER_WIDTH, GRID_SPACING, TILE_SIZE, SCREEN_WIDTH, SCREEN_HEIGHT } from "./constants/layout"
const styles = StyleSheet.create({

  // NOTE!!!: Group 1 Places your styles here
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(223, 51, 110, 0.34)",
  },

  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 72,
    paddingTop: Platform.select({
      ios: 48,
      android: (StatusBar.currentHeight ?? 0) + 24,
      default: 24,
    }),
  },

  displayText: {
    maxWidth: 240,
    marginBottom: 28,
    fontSize: 42,
    fontWeight: "800",
    lineHeight: 46,
    color: "#FFFFFF",
  },

  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    marginBottom: 14,
    borderRadius: 999,
    backgroundColor: "#ff2b78",
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3A3A3A",
  },

  // ------------------Group 1 styles End-------------------



  // NOTE!!!: Group 2 Places your styles here
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "flex-start",
    paddingTop: Platform.OS === "android" ? 40 : 50,
    paddingHorizontal: 25,
  },

  // Header Section Styles - by DARE
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 10,
    width: '100%',
  },

  headerContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '58%',
  },

  backButton: {
    marginBottom: 8,
    left: -4,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
    marginBottom: 10,
  },

  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 25,
  },

  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 13,
  },

  // Header Profile Content Styles - by DARE
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  profileTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    left: 10,
  },

  editButton: {
    fontSize: 16,
    color: '#888',
    left: 10,
  },

  profileContainer: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center'
  },

  profileContent: {
    flex: 1,
    minHeight: 0,
  },

  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  profileLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  // Match Header styles - by DARE
  matchHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  matchHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  matchBackButton: {
    padding: 5,
  },

  // Email Password Login Section Styles - Micah
  formContainer: {
    width: '100%',
    marginTop: 40,
    gap: 20,
  },

  inputContainer: {
    height: 48,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  input: {
    fontSize: 16,
    color: '#2e2e2e',
    flex: 1,
  },

  forgotButton: {
    alignSelf: 'flex-start',
    marginTop: -2,
    marginBottom: 16,
    left: 3,
  },

  forgotText: {
    color: '#ff2b78',
    fontSize: 14,
    fontWeight: '600',
  },

  backButton2: {
    marginLeft: -20
  },

  // Profile Stat styles - by Micah
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 40,
  },

  stat: {
    alignItems: 'center'
  },

  statNumber: {
    color: '#ff4d6d',
    fontSize: 18,
    fontWeight: '600',
  },

  statLabel: {
    color: '#666',
  },

  // Overlapping Profiles styles - by Micah
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // Necessary for absolute children
  },

  profileImageP: {
    borderWidth: 3,
    borderColor: '#fff', // Creates the "cutout" look
  },

  heartContainer: {
    position: 'absolute',
    backgroundColor: '#FF2D55',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  heartText: {
    fontSize: 16,
  },

  // Social Login Section Styles - by Ifunanya

  containerGallery: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  socialLoginContainer: {
    width: '100%',
    paddingVertical: 16,
    gap: 28,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },

  dividerLabel: {
    fontSize: 15,
    color: '#6B7280',
  },

  socialButton: {
    height: 48,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -10,
  },

  facebook: {
    backgroundColor: '#3b5998',
  },

  gmail: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  facebookContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  facebookIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },

  gmailText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },

  termsText: {
    marginTop: 70,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  loginButton: {
    height: 48,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff2b78',
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Profile Gallery styles - by Ifunanya
  tabView: {
    flex: 1,
  },

  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 0,

  },

  tabIndicator: {
    backgroundColor: '#ff2b78',
    height: 3,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    width: 65,
    marginLeft: 48,
  },

  tabLabel: {
    fontSize: 16,
    textTransform: 'none',
    fontWeight: '600',
  },

  tabItem: {
    width: 'auto',
    paddingHorizontal: 6,
  },

  about: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  aboutText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },

  inner: {
    flex: 1,
    width: INNER_WIDTH,
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  // ── Grid ──────────────────────────────────────────────
  grid: {
    // Match TILE_SIZE math: outer padding (2*4) + tile margins (6*4) = GRID_SPACING*(COLUMNS+1)
    paddingHorizontal: GRID_SPACING / 2,
    paddingTop: 14,
    paddingBottom: 14,
  },

  gridFill: {
    flexGrow: 1,
  },

  galleryList: {
    flex: 1,
  },

  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE * 1.05,
    borderRadius: 14,
    overflow: 'hidden',
    margin: GRID_SPACING / 2,
  },

  tileImage: {
    width: '100%',
    height: '100%',
  },

  // ── Full-screen viewer ────────────────────────────────
  viewerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  viewerSlide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewerImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  closeBtn: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  // Match Congrats section by Infunanya
  titleMC: {
    color: '#FF3B7C',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 20,
  },

  subtitleMC: {
    color: '#A3A3A3',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 320,
  },


  // ------------------Group 2 styles End-------------------


  // NOTE!!!: Group 3 has been refactored for clarity and responsiveness.
  // These styles are intended for the SignUp screen.
  signUpContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },

  // Use SafeAreaView for top/bottom padding in your component
  // e.g., <SafeAreaView style={styles.signUpContainer} edges={['top', 'bottom']}>

  signUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16, // Adjust as needed
    marginBottom: 24,
  },

  signUpBackArrow: {
    padding: 8,
    marginLeft: -8,
  },

  signUpTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },

  signUpSubtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 32,
  },

  signUpForm: {
    width: '100%',
    gap: 20,
  },

  signUpInput: {
    height: 48,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    justifyContent: 'center',
    color: '#aaa'
  },

  signUpPasswordContainer: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },

  signUpPasswordInput: {
    paddingRight: 48,
  },

  signUpPasswordToggle: {
    position: 'absolute',
    right: 16,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  signUpButton: {
    height: 48,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff2b78',
    marginTop: 24,
  },

  signUpButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  signUpTermsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },

  signUpTermsText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    lineHeight: 20,
  },

  signUpTermsLink: {
    color: '#ff2b78',
    fontWeight: 'bold',
  },

  // Place the footer outside the ScrollView for it to stick to the bottom
  signUpFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20, // Space from bottom and content
  },

  signUpFooterText: {
    color: 'gray',
    fontSize: 14,
  },

  signUpFooterLink: {
    color: '#ea147c',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },

  headerTitle2: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
    marginLeft: 85,
  },

  navigationContainer:{
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    left: 0,
    right: 0,
    height: 66,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderColor: "#ddd",
    paddingHorizontal: 40,
  },
  fab: {
    position: "absolute",
    left: "50%",
    marginLeft: -30,
    backgroundColor: "#FF4D6D",
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#ff4d6d',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    zIndex: 2,
  },

  profileScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 14 : 6,
    paddingBottom: 12,
  },

  profileHeaderButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  profileHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  profileEditButton: {
    minWidth: 36,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  profileEditText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  profileContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 130,
  },

  profileAvatarSection: {
    alignItems: "center",
    marginBottom: 26,
  },

  profileAvatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    marginBottom: 14,
  },

  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  profileLocation: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  profileStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 10,
  },

  profileStatBlock: {
    alignItems: "center",
    flex: 1,
  },

  profileStatValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF4D6D",
    marginBottom: 4,
  },

  profileStatLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  profileTabsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    marginBottom: 22,
  },

  profileTabButton: {
    alignItems: "center",
    minWidth: 70,
  },

  profileTabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#9CA3AF",
  },

  profileTabTextActive: {
    color: "#111827",
    fontWeight: "700",
  },

  profileTabUnderline: {
    marginTop: 8,
    width: 34,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#FF4D6D",
  },

  profileAboutCard: {
    backgroundColor: "#FFF5F8",
    borderRadius: 22,
    padding: 20,
  },

  profileAboutTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  profileAboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
  },

  profileGalleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },

  profileGalleryImage: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 16,
  },

  profileDetailsScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  profileDetailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 6 : 10,
    paddingBottom: 10,
  },

  profileDetailsHeaderButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  profileDetailsHeaderTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },

  profileDetailsSaveButton: {
    minWidth: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  profileDetailsSaveText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF4D6D",
  },

  profileDetailsContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 90,
  },

  profileDetailsAvatarWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  profileDetailsAvatarFrame: {
    position: "relative",
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },

  profileDetailsAvatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },

  profileDetailsCameraButton: {
    position: "absolute",
    right: -4,
    bottom: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FF4D6D",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  profileDetailsFields: {
    gap: 0,
  },

  profileDetailsFieldCard: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingTop: 12,
    paddingBottom: 20,
  },

  profileDetailsFieldLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 10,
  },

  profileDetailsFieldValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  profileDetailsFieldInput: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    paddingVertical: 0,
    minHeight: 24,
  },

  defaultProfileScreen: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 40 : 50,
  },

  defaultProfileHeaderContainer: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: "center",
  },

  defaultProfileHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  defaultProfileBackButton: {
    marginLeft: -20,
  },

  defaultProfileTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    left: 10,
  },

  defaultProfileEditButton: {
    fontSize: 16,
    color: "#888",
    left: 10,
  },

  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  defaultProfileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  defaultProfileLocation: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },

  defaultProfileStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 40,
  },

  defaultProfileStat: {
    alignItems: "center",
  },

  defaultProfileStatNumber: {
    color: "#ff4d6d",
    fontSize: 18,
    fontWeight: "600",
  },

  defaultProfileStatLabel: {
    color: "#666",
  },

  defaultProfileContent: {
    flex: 1,
    minHeight: 0,
  },

  defaultProfileTabRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 28,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  defaultProfileTabButton: {
    alignItems: "center",
    minWidth: 72,
  },

  defaultProfileTabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },

  defaultProfileTabTextActive: {
    color: "#333",
  },

  defaultProfileTabIndicator: {
    marginTop: 8,
    height: 3,
    width: 65,
    borderRadius: 20,
    backgroundColor: "#ff2b78",
  },

  defaultProfileAbout: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  defaultProfileAboutText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },

  defaultProfileGalleryWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  defaultProfileInner: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignSelf: "center",
    borderRadius: 18,
    overflow: "hidden",
  },

  defaultProfileGalleryList: {
    flex: 1,
  },

  defaultProfileGrid: {
    paddingHorizontal: 5,
    paddingTop: 14,
    paddingBottom: 120,
  },

  defaultProfileTile: {
    width: "30.5%",
    aspectRatio: 0.95,
    borderRadius: 14,
    overflow: "hidden",
    margin: 5,
  },

  defaultProfileTileImage: {
    width: "100%",
    height: "100%",
  },

  defaultProfileViewerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },

  defaultProfileViewerSlide: {
    width: 360,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  defaultProfileViewerImage: {
    width: 360,
    height: "100%",
  },

  defaultProfileCloseBtn: {
    position: "absolute",
    top: 48,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  defaultProfileCloseText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  // Popup / Modal styles (used in LoginUI)
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  popupCard: {
    width: "82%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },

  popupTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },

  popupTitleSuccess: {
    color: "#22C55E",
  },

  popupTitleError: {
    color: "#EF4444",
  },

  popupMessage: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },

  popupButton: {
    width: "100%",
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },

  popupButtonSuccess: {
    backgroundColor: "#ff2b78",
  },

  popupButtonError: {
    backgroundColor: "#EF4444",
  },

  popupButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  swipeScreen: {
  flex: 1,
  backgroundColor: "#fff",
  paddingTop:
    Platform.OS === "android"
      ? (StatusBar.currentHeight ?? 0) + 20
      : 60,
  paddingHorizontal: 20,
},

swipeHeader: {
  marginBottom: 18,
},

swipeTitle: {
  fontSize: 32,
  fontWeight: "800",
  color: "#111827",
},

swipeSubtitle: {
  marginTop: 6,
  fontSize: 15,
  color: "#888",
},

swipeCardStack: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
},

swipeCard: {
  width: "100%",
  height: 500,
  borderRadius: 30,
  overflow: "hidden",
  backgroundColor: "#FFE4EC",
},

swipeFrontCard: {
  position: "absolute",
  zIndex: 2,
},

swipeBackCard: {
  position: "absolute",
  width: "92%",
  height: 480,
  transform: [{ translateY: 30 }, { scale: 0.96 }],
  zIndex: 1,
  opacity: 1,
},

swipeImage: {
  flex: 1,
  justifyContent: "flex-end",
},

swipeImageRadius: {
  borderRadius: 30,
},

swipeOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0,0,0,0.22)",
},

swipeBackOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0,0,0,0.16)",
},

swipeProfileInfo: {
  padding: 22,
},

swipeProfileName: {
  fontSize: 32,
  fontWeight: "800",
  color: "#fff",
},

swipeProfileCountry: {
  marginTop: 6,
  fontSize: 15,
  color: "#F3F4F6",
},

swipeBackProfileInfo: {
  padding: 20,
},

swipeBackProfileName: {
  fontSize: 26,
  fontWeight: "800",
  color: "#fff",
},

swipeBackProfileCountry: {
  marginTop: 5,
  fontSize: 14,
  color: "#F3F4F6",
},

swipeBigButton: {
  alignSelf: "center",
  width: "82%",
  height: 56,
  borderRadius: 999,
  backgroundColor: "#FF4D6D",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 96,
},

  swipeBigButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "800",
},

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  greeting: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 4,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
  },

  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFF1F5",
    alignItems: "center",
    justifyContent: "center",
  },

  cardStack: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    height: 540,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#FFE4EC",
  },

  frontCard: {
    position: "absolute",
    zIndex: 2,
  },

  backCard: {
    position: "absolute",
    width: "92%",
    height: 518,
    transform: [{ translateY: 24 }, { scale: 0.96 }],
    zIndex: 1,
    opacity: 0.95,
  },

  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
  },

  cardImageRadius: {
    borderRadius: 30,
  },

  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  cardInfo: {
    paddingHorizontal: 22,
    paddingBottom: 36,
  },

  cardName: {
    fontSize: 31,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  cardLocation: {
    marginTop: 6,
    fontSize: 15,
    color: "#F3F4F6",
  },

  cardBio: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: "#F9FAFB",
  },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },

  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  tagText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  stamp: {
    position: "absolute",
    top: 46,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 3,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  likeStamp: {
    left: 22,
    borderColor: "#22C55E",
    transform: [{ rotate: "-14deg" }],
  },

  nopeStamp: {
    right: 22,
    borderColor: "#EF4444",
    transform: [{ rotate: "14deg" }],
  },

  likeStampText: {
    color: "#22C55E",
    fontSize: 28,
    fontWeight: "800",
  },

  nopeStampText: {
    color: "#EF4444",
    fontSize: 28,
    fontWeight: "800",
  },

  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
  },

  emptyStateText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 28,
    marginBottom: 20,
  },

  refreshProfilesButton: {
    minWidth: 140,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#FF4D6D",
    alignItems: "center",
    justifyContent: "center",
  },

  refreshProfilesButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

})

export default styles;
