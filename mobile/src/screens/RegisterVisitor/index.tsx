import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import QRCode from 'react-native-qrcode-svg';
import { ScreenContainer } from '../../components/ScreenContainer';
import { GlassButton } from '../../components/GlassButton';
import { GlassCard } from '../../components/GlassCard';
import { Field } from '../../components/Field';
import { createVisitor } from '../../api/visitors';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import type { Visitor } from '../../api/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function RegisterVisitorScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [personToMeet, setPersonToMeet] = useState('');
  const [purpose, setPurpose] = useState('');
  const [checkInNow, setCheckInNow] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  // After successful registration with "check in now", show the badge QR.
  const [badge, setBadge] = useState<Visitor | null>(null);

  const pickPhoto = async () => {
    const res = await ImagePicker.launchCameraAsync({
      quality: 0.3,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!res.canceled && res.assets[0]?.base64) {
      setPhoto(`data:image/jpeg;base64,${res.assets[0].base64}`);
    }
  };

  const submit = async () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter the visitor name.');
      return;
    }
    setLoading(true);
    try {
      const created = await createVisitor({
        name: name.trim(),
        phone: phone.trim(),
        company: company.trim(),
        personToMeet: personToMeet.trim(),
        purpose: purpose.trim(),
        status: checkInNow ? 'checked-in' : 'expected',
        checkInTime: checkInNow ? new Date().toISOString() : undefined,
        photo,
      });
      if (checkInNow) {
        setBadge(created); // show the printable badge QR
      } else {
        Alert.alert('Registered', `${name.trim()} added as expected.`);
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (badge) {
    return (
      <ScreenContainer style={styles.badgeWrap}>
        <Text style={styles.title}>Visitor badge</Text>
        <GlassCard style={styles.badgeCard}>
          {photo ? <Image source={{ uri: photo }} style={styles.badgePhoto} /> : null}
          <Text style={styles.badgeName}>{badge.name}</Text>
          <Text style={styles.badgeSub}>{badge.company || badge.personToMeet || 'Visitor'}</Text>
          <View style={styles.qrBox}>
            <QRCode value={badge.qrToken ?? badge._id} size={170} backgroundColor="transparent" color={colors.text} />
          </View>
          <Text style={styles.badgeHint}>Front desk scans this to check in / verify</Text>
        </GlassCard>
        <GlassButton label="Done" variant="primary" onPress={() => navigation.popToTop()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.content}>
      <Text style={styles.title}>Register visitor</Text>

      <GlassCard style={styles.card}>
        <View style={styles.photoRow}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder]}>
              <Text style={styles.photoPlaceholderText}>📷</Text>
            </View>
          )}
          <GlassButton label={photo ? 'Retake photo' : 'Take photo'} variant="subtle" onPress={pickPhoto} />
        </View>
        <Field label="Full name *" value={name} onChangeText={setName} placeholder="e.g. Jane Cooper" />
        <Field
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="+1 555 010 0000"
          keyboardType="phone-pad"
        />
        <Field label="Company" value={company} onChangeText={setCompany} placeholder="Company name" />
        <Field
          label="Person to meet"
          value={personToMeet}
          onChangeText={setPersonToMeet}
          placeholder="Host name"
        />
        <Field
          label="Purpose"
          value={purpose}
          onChangeText={setPurpose}
          placeholder="Interview, meeting, delivery…"
        />
      </GlassCard>

      <View style={styles.toggleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.toggleLabel}>Check in now</Text>
          <Text style={styles.toggleSub}>Marks this visitor as currently checked-in</Text>
        </View>
        <Switch value={checkInNow} onValueChange={setCheckInNow} trackColor={{ true: colors.success }} />
      </View>

      <GlassButton
        label={checkInNow ? 'Check in & issue badge' : 'Save as expected'}
        onPress={submit}
        loading={loading}
        variant="primary"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 16 },
  card: { marginBottom: 16 },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  photo: { width: 64, height: 64, borderRadius: 32 },
  photoPlaceholder: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: { fontSize: 24, opacity: 0.6 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 14,
    marginBottom: 16,
  },
  toggleLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  toggleSub: { marginTop: 2, fontSize: 12, color: colors.subtext },
  badgeWrap: { paddingTop: 8 },
  badgeCard: { alignItems: 'center', paddingVertical: 22, marginBottom: 18 },
  badgePhoto: { width: 78, height: 78, borderRadius: 39, marginBottom: 10 },
  badgeName: { fontSize: 20, fontWeight: '800', color: colors.text },
  badgeSub: { fontSize: 13, color: colors.subtext, marginBottom: 14 },
  qrBox: { padding: 14, backgroundColor: '#fff', borderRadius: 16, marginBottom: 12 },
  badgeHint: { fontSize: 12, color: colors.subtle, textAlign: 'center' },
});