// src/styles/theme.ts
import { StyleSheet } from 'react-native';
import { colors } from '../utils/helpers';

export const theme = {
  colors,
};

export const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 30 },
  center: { alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 64, color: '#fff', fontWeight: '800' },
  slogan: { marginTop: 6, color: '#dff8ee', fontSize: 14 },
  welcomeTitle: { fontSize: 28, color: colors.light, fontWeight: '700', textAlign: 'center' },
  welcomeText: { textAlign: 'center', marginVertical: 12, color: colors.muted },
  input: { padding: 12, borderRadius: 8, backgroundColor: '#fff', marginVertical: 8, width: '100%' },
  primaryButton: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: 'center' },
  ghostButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: colors.light,
    borderWidth: 1,
    width: 200,
  },
  toggle: { color: colors.light, padding: 8 },
  toggleActive: { fontWeight: '700', color: colors.accent },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  categoryCard: { padding: 12, borderRadius: 10, backgroundColor: '#fff', marginRight: 10 },
  smallButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    width: 100,
  },
  pill: { padding: 12, borderRadius: 40, backgroundColor: '#fff', marginTop: 10 },
});
