import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  KeyboardAvoidingView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SUPPORT_EMAIL =
  process.env.EXPO_PUBLIC_SUPPORT_EMAIL || 'support@abhyas.local';

const REQUEST_TYPES = [
  {
    id: 'General Support',
    title: 'General Support',
    icon: 'chatbubble-ellipses-outline',
    desc: 'Account, syllabus, or study guidance'
  },
  {
    id: 'Feature Request',
    title: 'Feature Request',
    icon: 'bulb-outline',
    desc: 'Suggest tracker features or improvements'
  },
  {
    id: 'Bug Report',
    title: 'Bug Report',
    icon: 'bug-outline',
    desc: 'Report app issues, timer bugs, or errors'
  }
];

export default function TicketSupportScreen({
  user,
  theme,
  isDarkMode = false,
  onBack,
  req
}) {
  const [activeSubTab, setActiveSubTab] = useState('create'); // 'create' | 'list'

  // Create Form state
  const [selectedType, setSelectedType] = useState('General Support');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Tickets list state
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketsError, setTicketsError] = useState(null);
  const [backendSupported, setBackendSupported] = useState(true);

  // View Details Modal state
  const [viewingTicket, setViewingTicket] = useState(null);

  // Edit Modal state
  const [editingTicket, setEditingTicket] = useState(null);
  const [editType, setEditType] = useState('General Support');
  const [editSubject, setEditSubject] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState(null);

  // Delete processing state
  const [deletingTicketId, setDeletingTicketId] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const C = theme || {
    bg: isDarkMode ? '#0f172a' : '#f7f9fe',
    white: isDarkMode ? '#1e293b' : '#ffffff',
    card: isDarkMode ? '#1e293b' : '#ffffff',
    ink: isDarkMode ? '#f8fafc' : '#142841',
    muted: isDarkMode ? '#94a3b8' : '#72849f',
    blue: isDarkMode ? '#60a5fa' : '#37689f',
    mid: isDarkMode ? '#93c5fd' : '#80a9e5',
    soft: isDarkMode ? '#334155' : '#e9f0fc',
    line: isDarkMode ? '#334155' : '#e8eef8',
    border: isDarkMode ? '#334155' : '#edf2fc',
    danger: '#ef4444',
    dangerSoft: isDarkMode ? '#450a0a' : '#fef2f2',
    warning: '#f59e0b',
    warningSoft: isDarkMode ? '#451a03' : '#fffbeb',
    success: '#10b981',
    successSoft: isDarkMode ? '#064e3b' : '#ecfdf5'
  };

  const txt = (size = 14, bold = false, color = C.ink) => ({
    fontSize: size,
    fontWeight: bold ? '700' : '400',
    color
  });

  const card = {
    backgroundColor: C.card || C.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border || C.line
  };

  const inputStyle = {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
    color: C.ink,
    fontSize: 14
  };

  // Fetch ticket history when switching to 'list' view
  useEffect(() => {
    if (activeSubTab === 'list' && req) {
      fetchMyTickets();
    }
  }, [activeSubTab]);

  async function fetchMyTickets() {
    setLoadingTickets(true);
    setTicketsError(null);

    try {
      // Attempt real GET request to /tickets
      const data = await req('/tickets', 'GET');
      const list = Array.isArray(data) ? data : data?.tickets || [];
      // Filter strictly by signed-in student's ID for data privacy
      const userTickets = user?.id
        ? list.filter(t => !t.userId || t.userId === user.id)
        : list;

      setTickets(userTickets);
      setBackendSupported(true);
    } catch (err) {
      // If endpoint doesn't exist (e.g. 404), report honest capability limitation
      setBackendSupported(false);
      setTicketsError(
        'The backend support ticket service (/api/tickets) is not yet available on this server.'
      );
    } finally {
      setLoadingTickets(false);
    }
  }

  // ────────── 1. CREATE TICKET ──────────
  async function handleSubmitTicket() {
    if (!selectedType) {
      Alert.alert('Category Required', 'Please select a request category.');
      return;
    }

    if (!message.trim()) {
      Alert.alert(
        'Message Required',
        'Please describe your inquiry, question, or issue in detail.'
      );
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const payload = {
        type: selectedType,
        subject: subject.trim() || `${selectedType} Request`,
        message: message.trim()
      };

      // Real API submission
      const result = await req('/tickets', 'POST', payload);

      // On verified success
      const ticketId = result?.id || result?.ticketId || 'SUBMITTED';
      setSubmitSuccess(
        `Ticket submitted successfully (#${ticketId}). Our support team will review it.`
      );
      // Clear inputs only on confirmed success
      setSubject('');
      setMessage('');

      // Refresh ticket list and switch to list tab so user sees their new ticket
      await fetchMyTickets();

      Alert.alert(
        'Ticket Submitted',
        `Your support request has been received. Ticket reference: #${ticketId}`,
        [
          {
            text: 'View My Tickets',
            onPress: () => setActiveSubTab('list')
          },
          { text: 'OK' }
        ]
      );
    } catch (err) {
      // On failure: Preserve user message so they never lose their inputs
      const errorMsg =
        err.message?.includes('404') || err.message?.includes('status 404')
          ? 'Ticket submission API (/api/tickets) is not yet supported by the backend server. Your message has been preserved.'
          : err.message || 'Unable to submit support ticket. Please retry.';

      setSubmitError(errorMsg);

      Alert.alert(
        'Submission Incomplete',
        `${errorMsg}\n\nYour message is preserved below. You can also reach our support team directly at ${SUPPORT_EMAIL}.`,
        [
          {
            text: 'Email Support Directly',
            onPress: () => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)
          },
          { text: 'Keep Message', style: 'cancel' }
        ]
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ────────── 2. EDIT TICKET ──────────
  function handleOpenEdit(ticket) {
    if (ticket.status === 'Resolved') {
      Alert.alert(
        'Ticket Closed',
        'This ticket is already marked as Resolved and can no longer be edited.'
      );
      return;
    }

    setEditingTicket(ticket);
    setEditType(ticket.type || 'General Support');
    setEditSubject(ticket.subject || '');
    setEditMessage(ticket.message || '');
    setEditError(null);
  }

  async function handleSaveEdit() {
    if (!editType) {
      Alert.alert('Category Required', 'Please select a request category.');
      return;
    }

    if (!editMessage.trim()) {
      Alert.alert('Message Required', 'Message cannot be empty.');
      return;
    }

    if (savingEdit) return;

    setSavingEdit(true);
    setEditError(null);

    try {
      const payload = {
        type: editType,
        subject: editSubject.trim() || `${editType} Request`,
        message: editMessage.trim()
      };

      // Real API update
      const updated = await req('/tickets/' + editingTicket.id, 'PATCH', payload);

      // Update state locally with real returned data or payload
      setTickets(prev =>
        prev.map(t =>
          t.id === editingTicket.id
            ? { ...t, ...payload, ...(updated || {}), updatedAt: new Date().toISOString() }
            : t
        )
      );

      // If details modal is open for this ticket, update it too
      if (viewingTicket?.id === editingTicket.id) {
        setViewingTicket(prev => ({ ...prev, ...payload, ...(updated || {}) }));
      }

      setEditingTicket(null);
      Alert.alert('Ticket Updated', 'Your changes have been saved successfully.');
    } catch (err) {
      // On failure: preserve user edits inside the edit form
      const errorMsg =
        err.message?.includes('404') || err.message?.includes('status 404')
          ? 'Ticket update API (/api/tickets/:id) is not yet supported by the backend server. Your edits have been kept.'
          : err.message || 'Unable to save ticket changes. Please retry.';

      setEditError(errorMsg);
      Alert.alert('Update Failed', errorMsg);
    } finally {
      setSavingEdit(false);
    }
  }

  // ────────── 3. DELETE TICKET ──────────
  function handleConfirmDelete(ticket) {
    if (!ticket) return;
    setTicketToDelete(ticket);
  }

  async function executeDeleteTicket(ticket) {
    if (!ticket) return;
    setDeletingTicketId(ticket.id);

    try {
      // Real API deletion
      await req('/tickets/' + ticket.id, 'DELETE');

      // Remove from state only after confirmed success
      setTickets(prev => prev.filter(t => t.id !== ticket.id));

      if (viewingTicket?.id === ticket.id) {
        setViewingTicket(null);
      }
      setTicketToDelete(null);
    } catch (err) {
      // Keep ticket in UI on failure
      const errorMsg =
        err.message?.includes('404') || err.message?.includes('status 404')
          ? 'Ticket deletion API (/api/tickets/:id) is not yet supported by the backend server. The ticket remains in your list.'
          : err.message || 'Unable to delete ticket. Please retry.';

      Alert.alert('Delete Failed', errorMsg);
    } finally {
      setDeletingTicketId(null);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 30 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Screen Title & Header */}
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text style={{ fontSize: 23, fontWeight: '700', color: C.ink }}>
              Ticket Support
            </Text>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: C.soft,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Ionicons name="headset-outline" size={21} color={C.blue} />
            </View>
          </View>
          <Text
            style={{
              fontSize: 12,
              color: C.muted,
              marginTop: 4,
              lineHeight: 17
            }}
          >
            Dedicated student assistance, bug reports & feature requests
          </Text>
        </View>

        {/* View Switcher Chips (Create Ticket vs View My Tickets) */}
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 16,
            backgroundColor: C.soft,
            borderRadius: 14,
            padding: 4
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveSubTab('create')}
            activeOpacity={0.8}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 11,
              alignItems: 'center',
              backgroundColor: activeSubTab === 'create' ? C.card : 'transparent'
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: activeSubTab === 'create' ? '700' : '500',
                color: activeSubTab === 'create' ? C.blue : C.muted
              }}
            >
              ✍️ Create Ticket
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSubTab('list')}
            activeOpacity={0.8}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 11,
              alignItems: 'center',
              backgroundColor: activeSubTab === 'list' ? C.card : 'transparent'
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: activeSubTab === 'list' ? '700' : '500',
                color: activeSubTab === 'list' ? C.blue : C.muted
              }}
            >
              📋 View My Tickets {tickets.length > 0 ? `(${tickets.length})` : ''}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ────────── SUBTAB 1: CREATE TICKET ────────── */}
        {activeSubTab === 'create' && (
          <>
            {/* Student Account Summary Card */}
            <View
              style={[
                card,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 14
                }
              ]}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: C.soft,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12
                }}
              >
                <Ionicons name="person-circle-outline" size={24} color={C.blue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={txt(13, true, C.ink)}>{user?.name || 'Student Aspirant'}</Text>
                <Text style={txt(11, false, C.muted)}>{user?.email || 'student@abhyas.local'}</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 10,
                  backgroundColor: C.soft
                }}
              >
                <Text style={txt(10, true, C.blue)}>STUDENT</Text>
              </View>
            </View>

            {/* Request Type Selector Card */}
            <View style={card}>
              <Text style={txt(14, true, C.ink)}>Select Request Type</Text>
              <Text style={[txt(12, false, C.muted), { marginTop: 2, marginBottom: 12 }]}>
                Choose the category that best matches your request:
              </Text>

              {REQUEST_TYPES.map(type => {
                const isSelected = selectedType === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => setSelectedType(type.id)}
                    activeOpacity={0.75}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 12,
                      borderRadius: 12,
                      marginBottom: 8,
                      borderWidth: 1.5,
                      borderColor: isSelected ? C.blue : C.border || C.line,
                      backgroundColor: isSelected ? C.soft : C.white
                    }}
                    accessibilityLabel={type.title}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: isSelected ? C.card : C.soft,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12
                      }}
                    >
                      <Ionicons
                        name={type.icon}
                        size={20}
                        color={isSelected ? C.blue : C.muted}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          txt(13, true, isSelected ? C.blue : C.ink),
                          { marginBottom: 2 }
                        ]}
                      >
                        {type.title}
                      </Text>
                      <Text style={txt(11, false, C.muted)}>{type.desc}</Text>
                    </View>
                    <Ionicons
                      name={
                        isSelected ? 'radio-button-on' : 'radio-button-off'
                      }
                      size={20}
                      color={isSelected ? C.blue : C.muted}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Ticket Subject & Message Input Card */}
            <View style={card}>
              <Text style={txt(14, true, C.ink)}>Ticket Details</Text>

              {/* Subject Input */}
              <Text style={[txt(12, true, C.ink), { marginTop: 12 }]}>
                Subject (Optional)
              </Text>
              <TextInput
                placeholder="e.g. Question about GS Paper II topic notes"
                placeholderTextColor={C.muted}
                value={subject}
                onChangeText={setSubject}
                style={inputStyle}
                editable={!submitting}
              />

              {/* Message Input */}
              <Text style={[txt(12, true, C.ink), { marginTop: 14 }]}>
                Message / Description <Text style={{ color: C.danger }}>*</Text>
              </Text>
              <TextInput
                placeholder="Please describe your question, issue, or feature idea in detail..."
                placeholderTextColor={C.muted}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                style={[
                  inputStyle,
                  {
                    minHeight: 110,
                    paddingTop: 12,
                    lineHeight: 20
                  }
                ]}
                editable={!submitting}
              />

              {/* Submission Error Banner */}
              {submitError && (
                <View
                  style={{
                    backgroundColor: C.dangerSoft,
                    borderRadius: 10,
                    padding: 12,
                    marginTop: 14,
                    borderWidth: 1,
                    borderColor: '#fca5a5'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="alert-circle" size={17} color={C.danger} />
                    <Text style={txt(12, true, C.danger)}>Submission Note</Text>
                  </View>
                  <Text style={[txt(11, false, C.danger), { marginTop: 4, lineHeight: 16 }]}>
                    {submitError}
                  </Text>
                </View>
              )}

              {/* Submission Success Banner */}
              {submitSuccess && (
                <View
                  style={{
                    backgroundColor: C.soft,
                    borderRadius: 10,
                    padding: 12,
                    marginTop: 14,
                    borderWidth: 1,
                    borderColor: C.blue
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="checkmark-circle" size={17} color={C.blue} />
                    <Text style={txt(12, true, C.blue)}>Success</Text>
                  </View>
                  <Text style={[txt(11, false, C.ink), { marginTop: 4, lineHeight: 16 }]}>
                    {submitSuccess}
                  </Text>
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmitTicket}
                disabled={submitting}
                activeOpacity={0.85}
                style={{
                  backgroundColor: C.blue,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',
                  marginTop: 16,
                  opacity: submitting ? 0.6 : 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                {submitting ? (
                  <>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#ffffff' }}>
                      Submitting Request...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="send" size={16} color="#ffffff" />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#ffffff' }}>
                      Submit Support Ticket
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Direct Email Support Alternative */}
            <View style={[card, { paddingVertical: 14 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="mail-outline" size={18} color={C.blue} />
                <Text style={txt(13, true, C.ink)}>Need Direct Email Assistance?</Text>
              </View>
              <Text style={[txt(12, false, C.muted), { marginTop: 4, lineHeight: 17 }]}>
                You can also email your academic queries directly to{' '}
                <Text
                  onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
                  style={{ color: C.blue, fontWeight: '600' }}
                >
                  {SUPPORT_EMAIL}
                </Text>
              </Text>
            </View>
          </>
        )}

        {/* ────────── SUBTAB 2: VIEW MY TICKETS ────────── */}
        {activeSubTab === 'list' && (
          <>
            {loadingTickets ? (
              <View style={[card, { alignItems: 'center', paddingVertical: 36 }]}>
                <ActivityIndicator color={C.blue} size="large" />
                <Text style={[txt(13, false, C.muted), { marginTop: 12 }]}>
                  Loading your ticket history...
                </Text>
              </View>
            ) : !backendSupported || ticketsError ? (
              <View style={card}>
                <View style={{ alignItems: 'center', paddingVertical: 18 }}>
                  <View
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 27,
                      backgroundColor: C.soft,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 12
                    }}
                  >
                    <Ionicons
                      name="cloud-offline-outline"
                      size={28}
                      color={C.blue}
                    />
                  </View>
                  <Text style={[txt(16, true, C.ink), { textAlign: 'center' }]}>
                    Ticket History Unavailable
                  </Text>
                  <Text
                    style={[
                      txt(12, false, C.muted),
                      {
                        textAlign: 'center',
                        marginTop: 6,
                        lineHeight: 18,
                        paddingHorizontal: 12
                      }
                    ]}
                  >
                    The backend ticket-tracking service (/api/tickets) is not yet
                    deployed on this server. Ticket records could not be retrieved.
                  </Text>
                </View>

                <View
                  style={{
                    borderTopWidth: 1,
                    borderColor: C.line,
                    paddingTop: 14,
                    marginTop: 6
                  }}
                >
                  <TouchableOpacity
                    onPress={fetchMyTickets}
                    style={{
                      backgroundColor: C.soft,
                      paddingVertical: 11,
                      borderRadius: 10,
                      alignItems: 'center',
                      marginBottom: 8
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: C.blue }}>
                      ↻ Check Again
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
                    style={{
                      paddingVertical: 10,
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ fontSize: 12, color: C.blue, fontWeight: '600' }}>
                      Email Support: {SUPPORT_EMAIL}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : tickets.length === 0 ? (
              <View style={[card, { alignItems: 'center', paddingVertical: 36 }]}>
                <View
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 27,
                    backgroundColor: C.soft,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 12
                  }}
                >
                  <Ionicons name="ticket-outline" size={28} color={C.blue} />
                </View>
                <Text style={txt(16, true, C.ink)}>No Support Tickets</Text>
                <Text
                  style={[
                    txt(12, false, C.muted),
                    { textAlign: 'center', marginTop: 6, lineHeight: 18 }
                  ]}
                >
                  You haven't submitted any support requests yet.
                </Text>

                <TouchableOpacity
                  onPress={() => setActiveSubTab('create')}
                  style={{
                    backgroundColor: C.blue,
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                    borderRadius: 10,
                    marginTop: 16
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#ffffff' }}>
                    + Create a Ticket
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              tickets.map((item, index) => {
                const statusColor =
                  item.status === 'Resolved'
                    ? '#10b981'
                    : item.status === 'In Progress'
                      ? '#f59e0b'
                      : C.blue;

                const formattedDate = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : 'Recent';

                const isDeleting = deletingTicketId === item.id;

                return (
                  <View key={item.id || index} style={card}>
                    {/* Header Row: Category Badge & Status */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 8,
                          backgroundColor: C.soft
                        }}
                      >
                        <Text style={txt(10, true, C.blue)}>
                          {item.type || 'General Support'}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5
                        }}
                      >
                        <View
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 4,
                            backgroundColor: statusColor
                          }}
                        />
                        <Text style={[txt(11, true), { color: statusColor }]}>
                          {item.status || 'Open'}
                        </Text>
                      </View>
                    </View>

                    {/* Subject */}
                    <Text style={txt(15, true, C.ink)}>
                      {item.subject || item.message?.slice(0, 40) || 'Support Request'}
                    </Text>

                    {/* Message Preview */}
                    <Text
                      numberOfLines={2}
                      style={[
                        txt(12, false, C.muted),
                        { marginTop: 6, lineHeight: 18 }
                      ]}
                    >
                      {item.message}
                    </Text>

                    {/* Metadata: Date & ID */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderColor: C.line
                      }}
                    >
                      <Text style={txt(11, false, C.muted)}>
                        {formattedDate}
                      </Text>
                      <Text style={txt(11, false, C.muted)}>
                        ID: #{item.id ? String(item.id).slice(-6) : index + 1}
                      </Text>
                    </View>

                    {/* Action Buttons: View Details, Edit, Delete */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 10,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderColor: C.line
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setViewingTicket(item)}
                        style={{
                          paddingVertical: 6,
                          paddingHorizontal: 10,
                          borderRadius: 8,
                          backgroundColor: C.soft,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Ionicons name="eye-outline" size={14} color={C.blue} />
                        <Text style={{ fontSize: 11, fontWeight: '600', color: C.blue }}>
                          Details
                        </Text>
                      </TouchableOpacity>

                      {item.status !== 'Resolved' && (
                        <TouchableOpacity
                          onPress={() => handleOpenEdit(item)}
                          style={{
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                            borderRadius: 8,
                            backgroundColor: C.soft,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <Ionicons name="create-outline" size={14} color={C.blue} />
                          <Text style={{ fontSize: 11, fontWeight: '600', color: C.blue }}>
                            Edit
                          </Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        onPress={() => handleConfirmDelete(item)}
                        disabled={isDeleting}
                        style={{
                          paddingVertical: 6,
                          paddingHorizontal: 10,
                          borderRadius: 8,
                          backgroundColor: C.dangerSoft,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                          opacity: isDeleting ? 0.5 : 1
                        }}
                      >
                        {isDeleting ? (
                          <ActivityIndicator size="small" color={C.danger} />
                        ) : (
                          <>
                            <Ionicons name="trash-outline" size={14} color={C.danger} />
                            <Text style={{ fontSize: 11, fontWeight: '600', color: C.danger }}>
                              Delete
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>

      {/* ────────── VIEW DETAILS MODAL ────────── */}
      {viewingTicket && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setViewingTicket(null)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 420,
                backgroundColor: C.white,
                borderRadius: 18,
                padding: 20,
                borderWidth: 1,
                borderColor: C.line,
                maxHeight: '85%'
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    backgroundColor: C.soft
                  }}
                >
                  <Text style={txt(11, true, C.blue)}>
                    {viewingTicket.type || 'General Support'}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setViewingTicket(null)}
                  style={{ padding: 4 }}
                >
                  <Ionicons name="close" size={22} color={C.muted} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Status Indicator */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor:
                        viewingTicket.status === 'Resolved'
                          ? '#10b981'
                          : viewingTicket.status === 'In Progress'
                            ? '#f59e0b'
                            : C.blue
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color:
                        viewingTicket.status === 'Resolved'
                          ? '#10b981'
                          : viewingTicket.status === 'In Progress'
                            ? '#f59e0b'
                            : C.blue
                    }}
                  >
                    Status: {viewingTicket.status || 'Open'}
                  </Text>
                </View>

                {/* Subject */}
                <Text style={txt(18, true, C.ink)}>
                  {viewingTicket.subject || 'Support Ticket'}
                </Text>

                {/* Ticket ID & Dates */}
                <Text style={[txt(11, false, C.muted), { marginTop: 4, marginBottom: 14 }]}>
                  ID: #{viewingTicket.id || 'N/A'} • Submitted:{' '}
                  {viewingTicket.createdAt
                    ? new Date(viewingTicket.createdAt).toLocaleString()
                    : 'Recent'}
                </Text>

                {/* Message Content */}
                <View
                  style={{
                    backgroundColor: C.bg,
                    borderRadius: 12,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: C.line,
                    marginBottom: 16
                  }}
                >
                  <Text style={[txt(11, true, C.muted), { marginBottom: 6 }]}>
                    DESCRIPTION / INQUIRY
                  </Text>
                  <Text style={[txt(13, false, C.ink), { lineHeight: 20 }]}>
                    {viewingTicket.message}
                  </Text>
                </View>
              </ScrollView>

              {/* Bottom Buttons */}
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                {viewingTicket.status !== 'Resolved' && (
                  <TouchableOpacity
                    onPress={() => {
                      const t = viewingTicket;
                      setViewingTicket(null);
                      handleOpenEdit(t);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: C.soft,
                      paddingVertical: 12,
                      borderRadius: 10,
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: C.blue }}>
                      ✎ Edit
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => {
                    const t = viewingTicket;
                    handleConfirmDelete(t);
                  }}
                  style={{
                    backgroundColor: C.dangerSoft,
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderRadius: 10,
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 4
                  }}
                >
                  <Ionicons name="trash-outline" size={16} color={C.danger} />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: C.danger }}>
                    Delete
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setViewingTicket(null)}
                  style={{
                    flex: 1,
                    backgroundColor: C.blue,
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#ffffff' }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ────────── DELETE CONFIRMATION MODAL (CROSS-PLATFORM) ────────── */}
      {ticketToDelete && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => !deletingTicketId && setTicketToDelete(null)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 380,
                backgroundColor: C.white,
                borderRadius: 18,
                padding: 22,
                borderWidth: 1,
                borderColor: C.line
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: C.dangerSoft,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginBottom: 14
                }}
              >
                <Ionicons name="trash-outline" size={24} color={C.danger} />
              </View>

              <Text
                style={[
                  txt(18, true, C.ink),
                  { textAlign: 'center', marginBottom: 8 }
                ]}
              >
                Delete Support Ticket?
              </Text>

              <Text
                numberOfLines={2}
                style={[
                  txt(14, true, C.blue),
                  { textAlign: 'center', marginBottom: 8 }
                ]}
              >
                "{ticketToDelete.subject || ticketToDelete.type || 'Support Request'}"
              </Text>

              <Text
                style={[
                  txt(12, false, C.muted),
                  { textAlign: 'center', marginBottom: 20, lineHeight: 18 }
                ]}
              >
                Are you sure you want to delete this ticket? This action cannot be undone and will permanently remove it from your records.
              </Text>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => setTicketToDelete(null)}
                  disabled={deletingTicketId !== null}
                  style={{
                    flex: 1,
                    backgroundColor: C.soft,
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: 'center',
                    opacity: deletingTicketId !== null ? 0.6 : 1
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: C.blue }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => executeDeleteTicket(ticketToDelete)}
                  disabled={deletingTicketId !== null}
                  style={{
                    flex: 1,
                    backgroundColor: C.danger,
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: 'center',
                    opacity: deletingTicketId !== null ? 0.6 : 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  {deletingTicketId === ticketToDelete.id ? (
                    <>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#ffffff' }}>
                        Deleting...
                      </Text>
                    </>
                  ) : (
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#ffffff' }}>
                      Delete
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ────────── EDIT TICKET MODAL ────────── */}
      {editingTicket && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => !savingEdit && setEditingTicket(null)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 420,
                backgroundColor: C.white,
                borderRadius: 18,
                padding: 20,
                borderWidth: 1,
                borderColor: C.line,
                maxHeight: '90%'
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 14
                }}
              >
                <Text style={txt(17, true, C.ink)}>Edit Support Ticket</Text>
                <TouchableOpacity
                  onPress={() => !savingEdit && setEditingTicket(null)}
                  style={{ padding: 4 }}
                >
                  <Ionicons name="close" size={22} color={C.muted} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Type Selection */}
                <Text style={txt(12, true, C.ink)}>Request Type</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                  {REQUEST_TYPES.map(type => {
                    const active = editType === type.id;
                    return (
                      <TouchableOpacity
                        key={type.id}
                        onPress={() => setEditType(type.id)}
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 8,
                          backgroundColor: active ? C.blue : C.soft
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '700',
                            color: active ? '#ffffff' : C.blue
                          }}
                        >
                          {type.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Subject */}
                <Text style={txt(12, true, C.ink)}>Subject</Text>
                <TextInput
                  value={editSubject}
                  onChangeText={setEditSubject}
                  placeholder="Subject"
                  placeholderTextColor={C.muted}
                  style={inputStyle}
                  editable={!savingEdit}
                />

                {/* Message */}
                <Text style={[txt(12, true, C.ink), { marginTop: 12 }]}>
                  Message <Text style={{ color: C.danger }}>*</Text>
                </Text>
                <TextInput
                  value={editMessage}
                  onChangeText={setEditMessage}
                  placeholder="Describe your issue or suggestion..."
                  placeholderTextColor={C.muted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={[inputStyle, { minHeight: 90, paddingTop: 10 }]}
                  editable={!savingEdit}
                />

                {/* Edit Error Banner */}
                {editError && (
                  <View
                    style={{
                      backgroundColor: C.dangerSoft,
                      borderRadius: 10,
                      padding: 10,
                      marginTop: 12,
                      borderWidth: 1,
                      borderColor: '#fca5a5'
                    }}
                  >
                    <Text style={[txt(11, false, C.danger), { lineHeight: 16 }]}>
                      {editError}
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                <TouchableOpacity
                  onPress={() => setEditingTicket(null)}
                  disabled={savingEdit}
                  style={{
                    flex: 1,
                    backgroundColor: C.soft,
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: 'center',
                    opacity: savingEdit ? 0.6 : 1
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: C.blue }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveEdit}
                  disabled={savingEdit}
                  style={{
                    flex: 1,
                    backgroundColor: C.blue,
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: 'center',
                    opacity: savingEdit ? 0.6 : 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  {savingEdit ? (
                    <>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#ffffff' }}>
                        Saving...
                      </Text>
                    </>
                  ) : (
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#ffffff' }}>
                      Save Changes
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}
