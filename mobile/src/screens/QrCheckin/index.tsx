import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ScreenContainer } from '../../components/ScreenContainer';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import { StatusBadge } from '../../components/StatusBadge';
import { checkInByQr } from '../../api/scanner';
import type { Visitor } from '../../api/types';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/**
 * QR check-in — scans the visitor badge QR (which encodes the visitor _id)
 * and checks them in instantly.
 */
export function QrCheckinScreen() {
  const navigation = useNavigation<Nav>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [busy, setBusy] = useState(false);

  const onScanned = async ({ data }: { data: string }) => {
    if (busy || visitor) return;
    setBusy(true);
    setScanning(false);
    try {
      const v = await checkInByQr(data.trim());
      setVisitor(v);
    } catch (e) {
      Alert.alert('Check-in failed', e instanceof Error ? e.message : 'Invalid QR code', [
        { text: 'Try again', onPress: () => setScanning(true) },
      ]);
      setScanning(true);
    } finally {
      setBusy(false);
    }
  };

  if (!permission) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={styles.muted}>Loading camera…</Text>
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer style={styles.content}>
        <Text style={styles.title}>QR check-in</Text>
        <GlassCard>
          <Text style={styles.muted}>
            Camera access is needed to scan visitor badges. Grant permission to continue.
          </Text>
          <GlassButton label="Grant camera access" variant="primary" onPress={requestPermission} />
        </GlassCard>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.content}>
      <Text style={styles.title}>Scan badge</Text>

      <View style={styles.camWrap}>
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanning && !visitor ? onScanned : undefined}
        />
        {scanning && !visitor && <View style={styles.reticule} />}
      </View>

      {visitor ? (
        <GlassCard style={styles.result}>
          <View style={styles.rowHead}>
            <Text style={styles.name}>{visitor.name}</Text>
            <StatusBadge status={visitor.status} />
          </View>
          <Text style={styles.muted}>Checked in just now. Have a great visit!</Text>
          <GlassButton label="Scan next" variant="subtle" onPress={() => { setVisitor(null); setScanning(true); }} />
        </GlassCard>
      ) : (
        <Text style={styles.hint}>
          Point at the QR code on the visitor badge to check them in.
        </Text>
      )}

      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Done</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8 },
  center: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 14 },
  camWrap: { height: 340, borderRadius: 22, overflow: 'hidden', marginBottom: 14 },
  reticule: {
    position: 'absolute',
    top: '30%', left: '15%', right: '15%', bottom: '30%',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    borderRadius: 18,
  },
  hint: { color: colors.subtext, textAlign: 'center', fontSize: 14, paddingHorizontal: 12 },
  result: { marginTop: 4 },
  rowHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 19, fontWeight: '800', color: colors.text },
  back: { textAlign: 'center', color: colors.primary, fontWeight: '700', marginTop: 10, fontSize: 15 },
  muted: { color: colors.subtle },
});
