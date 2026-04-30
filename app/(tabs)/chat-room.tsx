import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/client/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MESSAGES, SEND_MESSAGE, ME_WITH_COUNTS } from '../../scripts/graphql';

const PINK = '#E8476A';

type MeData = {
  me?: {
    id: string;
  };
};

type ChatMessage = {
  id: string;
  text?: string;
  createdAt?: string;
  sender?: {
    id?: string;
    username?: string;
  };
};

type MessagesData = {
  messages: ChatMessage[];
};

type SendMessageData = {
  sendMessage: ChatMessage;
};

export default function ChatRoomScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'android'
    ? (StatusBar.currentHeight ?? 0) + 8
    : insets.top + 8;
  const bottomPad = Platform.OS === 'ios' ? insets.bottom : 8;

  const { chatId, chatName } = useLocalSearchParams<{ chatId: string; chatName?: string }>();
  const [input, setInput] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Get current user ID to distinguish sent vs received messages
  const { data: meData } = useQuery<MeData>(ME_WITH_COUNTS);
  const myId = meData?.me?.id;

  const { data, loading, startPolling, stopPolling } = useQuery<MessagesData>(MESSAGES, {
    variables: { chatId, limit: 60 },
    skip: !chatId,
    fetchPolicy: 'cache-and-network',
  });

  const [sendMessage, { loading: sending }] = useMutation<SendMessageData>(SEND_MESSAGE, {
    refetchQueries: [{ query: MESSAGES, variables: { chatId, limit: 60 } }],
  });

  useEffect(() => {
    if (!chatId) return;
    startPolling(3000);
    return () => stopPolling();
  }, [chatId]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const messages = data?.messages ?? [];

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !chatId) return;
    setInput('');
    try {
      await sendMessage({ variables: { chatId, text } });
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e: any) {
      console.warn('Send error:', e.message);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Responsive header */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={PINK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {chatName ?? 'Chat'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {loading && messages.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PINK} />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatText}>No messages yet — say hi! 👋</Text>
              </View>
            }
            renderItem={({ item }) => {
              const fromMe = myId && item.sender?.id === myId;
              return (
                <View style={[styles.msgRow, fromMe ? styles.msgRowMe : styles.msgRowThem]}>
                  {!fromMe && (
                    <View style={styles.senderInitial}>
                      <Text style={styles.senderInitialText}>
                        {(item.sender?.username ?? '?')[0].toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View style={fromMe ? styles.msgRight : styles.msgLeft}>
                    <View style={[styles.bubble, fromMe ? styles.bubbleMe : styles.bubbleThem]}>
                      <Text style={[styles.bubbleText, fromMe && styles.bubbleTextMe]}>
                        {item.text}
                      </Text>
                    </View>
                    <Text style={[styles.msgTime, fromMe && { textAlign: 'right' }]}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </Text>
                  </View>
                </View>
              );
            }}
          />

          <View
            style={[
              styles.inputBar,
              { paddingBottom: keyboardVisible ? 0 : bottomPad + 38 },
            ]}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message…"
              placeholderTextColor="#B0B0B0"
              style={styles.textInput}
              multiline
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={sending || !input.trim()}
              style={[
                styles.sendBtn,
                input.trim() ? styles.sendBtnActive : styles.sendBtnInactive,
              ]}>
              {sending
                ? <ActivityIndicator size="small" color="#fff" />
                : <Ionicons name="send" size={18} color="#fff" />}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: { padding: 4, minWidth: 40 },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontSize: 17, fontWeight: '700', color: '#111',
  },
  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyChatText: { fontSize: 14, color: '#bbb' },
  messageList: { paddingHorizontal: 14, paddingVertical: 12, flexGrow: 1 },
  msgRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  msgRowMe: { justifyContent: 'flex-end' },
  msgRowThem: { justifyContent: 'flex-start' },
  senderInitial: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#FFD6E0',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 8,
  },
  senderInitialText: { fontSize: 13, fontWeight: '700', color: PINK },
  msgRight: { maxWidth: '72%', alignItems: 'flex-end' },
  msgLeft: { maxWidth: '72%', alignItems: 'flex-start' },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleMe: { backgroundColor: PINK, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: '#F3F4F6', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 14, color: '#1F2937', lineHeight: 20 },
  bubbleTextMe: { color: '#fff' },
  msgTime: { fontSize: 10, color: '#bbb', marginTop: 4, marginHorizontal: 4 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F0F0F0',
    gap: 10,
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 15,
    color: '#111',
  },
  sendBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnActive: { backgroundColor: PINK },
  sendBtnInactive: { backgroundColor: '#E5E7EB' },
});
