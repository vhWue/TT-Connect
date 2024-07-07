import { View, Text, ActivityIndicator, FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useTournamentsWithInfiniteScroll } from '@/api/turniere';
import { useInsertCompetitionRegistrationSubscription } from '@/api/turniere/subscriptions';
import BaseScreen from '@/components/BaseScreen';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { FadeIn } from 'react-native-reanimated';
import KalenderCard from '@/components/Custom/TurnierCard/KalenderCard';

const OverviewTournamentsScreen = () => {
  useInsertCompetitionRegistrationSubscription();
  const { playerProfile } = useAuth();
  const router = useRouter();


  const { data: t, fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
    error, isLoading } = useTournamentsWithInfiniteScroll();

  if (!playerProfile) {
    return <Text>Please log in to see your registered tournaments.</Text>;
  }


  const handleOnPress = (id: number) => {
    router.push(`(user)/turniere/staffeln/${id}`);
  }

  if (isLoading) {
    return <ActivityIndicator size='large' style={{ position: 'absolute', left: '45%', top: '50%' }} />;
  }

  if (!t) {
    return <Text>Du hast dich bisher für keine Turniere angemeldet</Text>;
  }

  const tournaments = t.pages.flatMap(page => page.data);
  return (
    <BaseScreen entering={FadeIn} ellipse={false} marginBottom={0}>
      {!isLoading && (
        <SafeAreaView style={styles.container}>
          <FlatList
            style={{ zIndex: 1000, paddingTop: 20 }}
            data={tournaments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleOnPress(item.id)} style={styles.itemContainer}>
                <KalenderCard data={item} />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}

            onEndReached={() => {
              console.log("end Reached");
              console.log("hasNextPage", hasNextPage);

              if (hasNextPage && !isFetchingNextPage && !isFetching) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.6}
            ListFooterComponent={<View style={styles.footer} />}
          />
        </SafeAreaView>
      )}
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  container: {
    top: -5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    marginBottom: 10, // Abstand zwischen den Elementen
  },
  footer: {
    height: 130, // Höhe des zusätzlichen Platzes am Ende der Liste
  },
  rightAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
  },
});


export default OverviewTournamentsScreen