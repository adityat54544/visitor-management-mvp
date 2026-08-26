import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { GlassButton } from '../../components/GlassButton';
import { GlassCard } from '../../components/GlassCard';
import { Field } from '../../components/Field';
import { createVisitor } from '../../api/visitors';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function RegisterVisitorScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [personToMeet, setPersonToMeet] = useState('');
  const [purpose, setPurpose] = useState('');
  const [checkInNow, setCheckInNow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter the visitor name.');
      return;
    }
    setLoading(true);
    try {
      await createVisitor({
        name: name.trim(),
        phone: phone.trim(),
        company: company.trim(),
        personToMeet: personToMeet.trim(),
        purpose: purpose.trim(),
        status: checkInNow ? 'checked-in' : 'expected',
        checkInTime: checkInNow ? new Date().toISOString() : undefined,
      });
      Alert.alert('Registered', `${name.trim()} has been ${checkInNow ? 'checked in' : 'added as expected'}.`);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.content}>
      <Text style={styles.title}>Register visitor</Text>

      <GlassCard style={styles.card}>
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
        label={checkInNow ? 'Check in visitor' : 'Save as expected'}
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
});