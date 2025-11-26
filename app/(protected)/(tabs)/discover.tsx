import { AnimatedBackground } from '@/components/ui/animated-background';
import { AppIcon } from '@/components/ui/app-icon';
import { GlassCard } from '@/components/ui/glass-card';
import { useTheme } from '@/context/theme-context';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCENE_CATEGORIES = [
  { id: 'indoor', label: 'Indoor', icon: 'home', color: '#8b5cf6' },
  { id: 'outdoor', label: 'Outdoor', icon: 'sunny', color: '#10b981' },
  { id: 'food', label: 'Food', icon: 'restaurant', color: '#f59e0b' },
  { id: 'people', label: 'People', icon: 'people', color: '#3b82f6' },
  { id: 'nature', label: 'Nature', icon: 'leaf', color: '#14b8a6' },
  { id: 'urban', label: 'Urban', icon: 'business', color: '#6366f1' },
];

const TRENDING_OBJECTS = [
  'book', 'laptop', 'phone', 'cup', 'bottle', 'chair', 
  'table', 'door', 'window', 'car', 'tree', 'flower'
];

export default function DiscoverPage() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const history: any[] = []; // Mock empty history
  const loading = false;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredHistory = history.filter(item => {
    const matchesSearch = searchQuery.trim() === '' || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.objects.some(obj => obj.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || item.scene?.toLowerCase().includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const objectCounts = history.reduce((acc, item) => {
    item.objects.forEach(obj => {
      acc[obj] = (acc[obj] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topObjects = Object.entries(objectCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12);

  return (
    <AnimatedBackground>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top + 20 }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Discover</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Explore your AI vision insights
          </Text>
        </View>

        {/* Search */}
        <GlassCard variant="surface" style={styles.searchCard}>
          <View style={styles.searchContainer}>
            <AppIcon name="search" size={20} color={colors.text.secondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text.primary }]}
              placeholder="Search objects, scenes..."
              placeholderTextColor={colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <AppIcon name="close-circle" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </GlassCard>

        {/* Scene Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Scene Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
            {SCENE_CATEGORIES.map(category => (
              <TouchableOpacity
                key={category.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCategory(selectedCategory === category.id ? null : category.id);
                }}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedCategory === category.id 
                      ? category.color 
                      : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  }
                ]}
              >
                <AppIcon 
                  name={category.icon as any} 
                  size={20} 
                  color={selectedCategory === category.id ? '#fff' : colors.text.primary} 
                />
                <Text 
                  style={[
                    styles.categoryText, 
                    { color: selectedCategory === category.id ? '#fff' : colors.text.primary }
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top Detected Objects */}
        {topObjects.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Most Detected Objects</Text>
            <View style={styles.objectsGrid}>
              {topObjects.map(([obj, count]) => (
                <TouchableOpacity
                  key={obj}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSearchQuery(obj);
                  }}
                  style={[
                    styles.objectCard,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }
                  ]}
                >
                  <View style={[styles.objectIconContainer, { backgroundColor: colors.primary.main + '20' }]}>
                    <AppIcon name="cube" size={24} color={colors.primary.main} />
                  </View>
                  <Text style={[styles.objectName, { color: colors.text.primary }]} numberOfLines={1}>
                    {obj}
                  </Text>
                  <Text style={[styles.objectCount, { color: colors.text.secondary }]}>
                    {count} time{count > 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Search Results / Recent */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            {searchQuery || selectedCategory ? 'Search Results' : 'Recent Analyses'}
          </Text>
          
          {filteredHistory.length === 0 ? (
            <GlassCard variant="surface" style={styles.emptyCard}>
              <AppIcon name="search" size={48} color={colors.text.secondary} />
              <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                {searchQuery || selectedCategory ? 'No results found' : 'No analyses yet'}
              </Text>
            </GlassCard>
          ) : (
            <View style={styles.resultsGrid}>
              {filteredHistory.slice(0, 6).map(item => (
                <GlassCard key={item.id} variant="surface" style={styles.resultCard}>
                  {item.image_uri && (
                    <Image source={{ uri: item.image_uri }} style={styles.resultImage} />
                  )}
                  <View style={styles.resultContent}>
                    <Text style={[styles.resultText, { color: colors.text.primary }]} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <View style={styles.resultTags}>
                      {item.objects.slice(0, 2).map((obj, idx) => (
                        <View key={idx} style={[styles.resultTag, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                          <Text style={[styles.resultTagText, { color: colors.text.secondary }]}>{obj}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </GlassCard>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Quick Actions</Text>
          <GlassCard variant="surface" style={styles.actionsCard}>
            <TouchableOpacity 
              style={styles.actionRow}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#8b5cf6' + '20' }]}>
                <AppIcon name="star" size={20} color="#8b5cf6" />
              </View>
              <View style={styles.actionText}>
                <Text style={[styles.actionTitle, { color: colors.text.primary }]}>Favorites</Text>
                <Text style={[styles.actionSubtitle, { color: colors.text.secondary }]}>
                  Save important analyses
                </Text>
              </View>
              <AppIcon name="chevron-forward" size={20} color={colors.text.secondary} />
            </TouchableOpacity>

            <View style={[styles.actionDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]} />

            <TouchableOpacity 
              style={styles.actionRow}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#10b981' + '20' }]}>
                <AppIcon name="share-social" size={20} color="#10b981" />
              </View>
              <View style={styles.actionText}>
                <Text style={[styles.actionTitle, { color: colors.text.primary }]}>Export Data</Text>
                <Text style={[styles.actionSubtitle, { color: colors.text.secondary }]}>
                  Download your insights
                </Text>
              </View>
              <AppIcon name="chevron-forward" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </GlassCard>
        </View>
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
  },
  searchCard: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  categoriesRow: {
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  objectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  objectCard: {
    width: '31%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  objectIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  objectName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  objectCount: {
    fontSize: 11,
  },
  resultsGrid: {
    gap: 12,
  },
  resultCard: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  resultContent: {
    flex: 1,
    gap: 8,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
  },
  resultTags: {
    flexDirection: 'row',
    gap: 6,
  },
  resultTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resultTagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
  actionsCard: {
    padding: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
  },
  actionDivider: {
    height: 1,
    marginVertical: 12,
  },
});
