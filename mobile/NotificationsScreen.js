import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { getTranslation } from './translations';

export default function NotificationsScreen({
  notes = [],
  user,
  onMarkRead,
  onBack,
  C,
  lang = 'en',
}) {
  const t = (k, fb = '') => getTranslation(lang, k, fb);
  const [selectedId, setSelectedId] = useState(null);

  const isRead = note =>
    (note.readBy || []).includes(user?.id);

  const formatDate = value => {
    if (!value) return 'Date unavailable';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Date unavailable';

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const selectedNote = notes.find(note => note.id === selectedId);

  const openNote = note => {
    setSelectedId(note.id);
    if (!isRead(note) && onMarkRead) onMarkRead(note);
  };

  const cell = (flex, extra = {}) => ({
    flex,
    minWidth: 0,
    paddingHorizontal: 5,
    paddingVertical: 11,
    justifyContent: 'center',
    ...extra,
  });

  const headerText = {
    color: C.ink,
    fontSize: 10,
    fontWeight: '800',
    flexWrap: 'wrap',
  };

  const bodyText = {
    color: C.ink,
    fontSize: 11,
    lineHeight: 16,
    flexWrap: 'wrap',
  };

  return (
    <View style={{ flex: 1, minWidth: 0 }}>
      <TouchableOpacity
        onPress={selectedNote ? () => setSelectedId(null) : onBack}
        style={{ marginBottom: 14 }}
      >
        <Text style={{ color: C.blue, fontSize: 13, fontWeight: '700' }}>
          {selectedNote ? t('allAnnouncements', '← All announcements') : t('backToApp', '← Back to app')}
        </Text>
      </TouchableOpacity>

      <Text style={{ color: C.ink, fontSize: 23, fontWeight: '800' }}>
        {selectedNote ? t('announcementDetails', 'Announcement Details') : t('announcements', 'Notifications')}
      </Text>

      <Text style={{ color: C.muted, fontSize: 12, marginTop: 5, marginBottom: 16 }}>
        {selectedNote
          ? t('completeAnnouncementInfo', 'Complete announcement information')
          : t('announcementsAndStatus', 'Announcements and read status')}
      </Text>

      {selectedNote ? (
        <View
          style={{
            backgroundColor: C.card,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text style={{
            color: isRead(selectedNote) ? C.green : C.amber,
            fontSize: 12,
            fontWeight: '800',
          }}>
            {isRead(selectedNote) ? t('readStatus', 'READ') : t('unreadStatus', 'UNREAD')}
          </Text>

          <Text style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>
            {t('posted', 'Posted')}: {formatDate(selectedNote.createdAt)}
          </Text>

          <Text style={{
            color: C.ink,
            fontSize: 20,
            fontWeight: '800',
            lineHeight: 28,
            marginTop: 16,
          }}>
            {selectedNote.title}
          </Text>

          <View style={{ height: 1, backgroundColor: C.line, marginVertical: 14 }} />

          <Text style={{ color: C.ink, fontSize: 15, lineHeight: 24 }}>
            {selectedNote.message}
          </Text>
        </View>
      ) : notes.length === 0 ? (
        <View style={{
          backgroundColor: C.card,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 12,
          padding: 20,
        }}>
          <Text style={{ color: C.ink, fontWeight: '700' }}>
            {t('noAnnouncementsYet', 'No announcements yet')}
          </Text>
        </View>
      ) : (
        <View style={{
          width: '100%',
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: C.card,
        }}>
          {/* Responsive table header */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: C.soft,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
          }}>
            <View style={cell(3, { borderRightWidth: 1, borderRightColor: C.border })}>
              <Text style={headerText}>{t('announcementCol', 'ANNOUNCEMENT')}</Text>
            </View>
            <View style={cell(1.6, { borderRightWidth: 1, borderRightColor: C.border })}>
              <Text style={headerText}>{t('dateCol', 'DATE')}</Text>
            </View>
            <View style={cell(1.15, { borderRightWidth: 1, borderRightColor: C.border })}>
              <Text style={headerText}>{t('statusCol', 'STATUS')}</Text>
            </View>
            <View style={cell(1)}>
              <Text style={headerText}>{t('actionCol', 'ACTION')}</Text>
            </View>
          </View>

          {/* Responsive table rows */}
          {notes.map((note, index) => {
            const read = isRead(note);

            return (
              <View
                key={note.id}
                style={{
                  flexDirection: 'row',
                  backgroundColor: index % 2 === 0 ? C.card : C.bg,
                  borderBottomWidth: index === notes.length - 1 ? 0 : 1,
                  borderBottomColor: C.border,
                }}
              >
                <TouchableOpacity
                  onPress={() => openNote(note)}
                  style={cell(3, { borderRightWidth: 1, borderRightColor: C.border })}
                >
                  <Text style={{
                    ...bodyText,
                    fontWeight: read ? '500' : '800',
                  }}>
                    {note.title}
                  </Text>
                </TouchableOpacity>

                <View style={cell(1.6, { borderRightWidth: 1, borderRightColor: C.border })}>
                  <Text style={{ color: C.muted, fontSize: 10, lineHeight: 14 }}>
                    {formatDate(note.createdAt)}
                  </Text>
                </View>

                <View style={cell(1.15, { borderRightWidth: 1, borderRightColor: C.border })}>
                  <Text style={{
                    color: read ? C.green : C.amber,
                    fontSize: 9,
                    fontWeight: '800',
                  }}>
                    {read ? t('readStatus', 'READ') : t('unreadStatus', 'UNREAD')}
                  </Text>
                </View>

                <View style={cell(1)}>
                  <TouchableOpacity
                    onPress={() => openNote(note)}
                    style={{
                      backgroundColor: C.soft,
                      borderRadius: 5,
                      paddingVertical: 6,
                      paddingHorizontal: 4,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: C.blue, fontSize: 10, fontWeight: '700' }}>
                      {t('viewAction', 'View')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
